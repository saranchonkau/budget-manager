import { FormEvent, useState } from "react";
import clsx from "clsx";
import classes from "./SignUpPage.module.css";
import { signUp } from "@/services/api";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <h1 className={clsx(classes.title, "fw-normal")}>Sign up</h1>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="john.doe@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" className="w-100 btn btn-lg btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
