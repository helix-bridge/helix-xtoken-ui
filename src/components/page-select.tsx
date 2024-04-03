"use client";

import HomePage from "./home-page";
import ProjectPage from "./project-page";

console.log("hostname:", window.location.hostname);
const isHomePage = window.location.hostname.split(".").length === 2;

export default function PageSelect() {
  return isHomePage ? <HomePage /> : <ProjectPage />;
}
