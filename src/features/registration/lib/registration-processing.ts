import { createClient, MatrixError } from 'matrix-js-sdk';
import { z } from 'zod';
import { registerFormSchema } from './validation-schemas';

type RegisterParams = z.infer<typeof registerFormSchema>;

export async function registerWithMatrix(data: RegisterParams) {
  const baseUrl = `https://${data.homeserver}`;
  const client = createClient({ baseUrl });

  try {
    const response = await client.registerRequest({
      username: data.username,
      password: data.password,
      auth: { type: 'm.login.dummy' },
    });
    console.log('Registration successful:', response);

    return response;
  } catch (error) {
    if (error instanceof MatrixError) {
      const errorMessage = error.data?.error || error.message;
      throw new Error(`Registration failed: ${errorMessage}`);
    } // Expand to handle specific errors
    throw new Error('An unexpected error occurred during registration.');
  }
}