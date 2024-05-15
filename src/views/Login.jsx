import React from "react";
import Header from "../components/Header";
import { LoginForm } from "../components/LoginForm";
import { Footer } from "../components/Footer";
import { Information } from "../components/Information";

export const Login = () => {
  return (
    <>
      <Header />

      <Information />
      <LoginForm />

      <Footer />
    </>
  );
};
