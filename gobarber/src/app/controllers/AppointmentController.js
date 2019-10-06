import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import Notification from '../schemas/Notification';

import CancelationMail from '../jobs/CancelationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(request, response) {
    const { page = 1 } = request.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: request.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return response.json(appointments);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(request.body)))
      return response.status(400).json({ error: 'Validation fails' });

    const { provider_id, date } = request.body;

    const userProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!userProvider) {
      response
        .status(400)
        .json({ error: 'You can only create appointments with providers' });
    }

    if (request.userId === provider_id) {
      return response
        .status(401)
        .json({ error: `User can't create an appointment with himself` });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past dates are not permitted' });
    }

    const appointmentAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (appointmentAvailability) {
      return response
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: request.userId,
      provider_id,
      date,
    });

    const user = await User.findByPk(request.userId);
    const formattedDate = format(hourStart, "dd'/'MMMM/yyyy'-'H:mm'h'");

    await Notification.create({
      content: `New appointment for ${user.name} at ${formattedDate}`,
      user: provider_id,
    });

    return response.json(appointment);
  }

  async delete(request, response) {
    const appointment = await Appointment.findByPk(request.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== request.userId) {
      return response.status(401).json({
        error: `You don't have permission to cancel this appointment.`,
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return response.status(401).json({
        error: `An appointment can only be canceled at least 2 hours in advance.`,
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancelationMail.key, {
      appointment,
    });

    return response.json(appointment);
  }
}

export default new AppointmentController();
