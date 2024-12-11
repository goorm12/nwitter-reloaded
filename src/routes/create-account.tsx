import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-component";
import GithubButton from "../components/github-btn";

const errors: Record<string, string> = {
  "auth/email-already-in-use": "이미 존재하는 이메일입니다.",
  "auth/weak-password": "비밀번호는 6자리 이상 입력해 주세요",
  "auth/invalid-login-credentials": "비밀번호가 틀립니다.",
};

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setIsError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    // if (name === "name") {
    //   setName(value);
    // } else if (name === "email") {
    //   setEmail(value);
    // } else if (name === "password") {
    //   setPassword(value);
    // }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError("");
    if (
      isLoading ||
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    )
      return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName: formData.name,
      });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        const errorMessage = errors[e.code];
        setIsError(errorMessage);
        console.log(e.code, e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join ❌</Title>
      <Form onSubmit={handleSubmin}>
        <Input
          onChange={handleChange}
          name="name"
          value={formData.name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={handleChange}
          name="email"
          value={formData.email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={handleChange}
          name="password"
          value={formData.password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          value={isLoading ? "Loading..." : "Create Account"}
          type="submit"
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Arready have an accout? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
