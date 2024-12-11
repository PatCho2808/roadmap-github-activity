#!/usr/bin/env node

import { program } from "commander";

program.argument("<username>", "A github username");

program.parse();

const username = program.args[0];
const url = `https://api.github.com/users/${username}/events/public`;

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    if (response.ok) {
      handleResponse(response);
    } else {
      console.error(error);
    }
  });

function handleResponse(response) {
  response.forEach((event) => {
    console.log(getEventDescription(event));
  });
}

function getEventDescription(event) {
  switch (event.type) {
    case "PushEvent":
      return `Pushed a commit to ${event.repo.name}`;
    case "CreateEvent":
      if (event.payload.ref_type === "repository") {
        return `Created new repo ${event.repo.name}`;
      } else if (event.payload.ref_type === "branch") {
        return `Created new branch in ${event.repo.name} of name ${event.payload.ref}`;
      }
    default:
      return "Uknown event type";
  }
}
