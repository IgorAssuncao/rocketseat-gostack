import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(8),
    });

    if (!(await schema.isValid(request.body)))
      return response.status(400).json({ error: 'Validation failed' });

    const userExists = await User.findOne({
      where: { email: request.body.email },
    });

    if (userExists) response.status(400).json({ error: 'User already exists' });

    const { name, email } = await User.create(request.body);

    return response.json({ name, email });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      oldPassword: Yup.string()
        .required()
        .min(8),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      passwordConfirmation: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(request.body)))
      return response.json({ error: 'Validation fails' });

    const { email, oldPassword } = request.body;

    const user = await User.findByPk(request.userId);

    if (email !== user.email) {
      const userEmailExists = await User.findOne({ where: { email } });

      if (userEmailExists)
        return response.status(400).json({ error: 'Email already exists' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return response.status(401).json({ error: 'Password does not match' });

    const newUserInfo = await user.update(request.body);

    return response.json({ email: newUserInfo.email });
  }
}

export default new UserController();
