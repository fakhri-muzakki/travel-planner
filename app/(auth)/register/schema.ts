import * as v from "valibot";

export const RegisterSchema = v.pipe(
  v.object({
    full_name: v.pipe(v.string(), v.minLength(5, "Minimum 5 characters")),
    email: v.pipe(v.string(), v.email("Invalid email address")),
    password: v.pipe(v.string(), v.minLength(8, "Minimum 8 characters")),
    confirm_password: v.string(),
  }),

  v.forward(
    v.check(
      (input) => input.password === input.confirm_password,
      "Password confirmation does not match",
    ),
    ["confirm_password"],
  ),
);

export type RegisterData = v.InferOutput<typeof RegisterSchema>;
