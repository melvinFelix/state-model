import "./styles.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createModel } from "xstate/lib/model";
import { useMachine } from "@xstate/react";
import { ContextFrom, EventFrom } from "xstate";

const userModel = createModel(
  {
    name: "David",
    age: 30
  },
  {
    events: {
      updateName: (value: string) => ({ value }),
      updateAge: (value: number) => ({ value }),
      anotherEvent: () => ({})
    }
  }
);

type UpdateNameEvent = ReturnType<typeof userModel.events.updateName>;
type UpdateAgeEvent = ReturnType<typeof userModel.events.updateAge>;

const assignName = userModel.assign(
  {
    name: (_, event: UpdateNameEvent) => event.value
  },
  "updateName"
);

const assignAge = userModel.assign(
  {
    age: (_, event: UpdateAgeEvent) => event.value
  },
  "updateAge"
);

const machine = userModel.createMachine({
  context: userModel.initialContext,
  initial: "active",
  states: {
    active: {
      on: {
        updateName: {
          actions: assignName
        },
        updateAge: {
          actions: assignAge
        }
      }
    }
  }
});

function App() {
  const [state, send] = useMachine(machine);
  const { name, age } = state.context;
  const userEvents = userModel.events;
  const handleName = (e: React.ChangeEvent) => {
    send(userEvents.updateName((e.target as HTMLInputElement).value));
  };
  const handleAge = (e: React.ChangeEvent) => {
    send(userEvents.updateAge(Number((e.target as HTMLInputElement).value)));
  };
  return (
    <div className="App">
      <label htmlFor="name">Name: {name}</label>
      <input id="name" onChange={handleName} />
      <button>update name</button>
      <br />
      <label htmlFor="age">Age: {age}</label>
      <input id="age" onChange={handleAge} />
      <button>update age</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
