// Immer 사용 -> 상태를 업데이트 할 때 불변성을 신경쓰지 않으면서 업데이트를 해주면 Immer가 대신 불변성 관리를 해줌
import React, { useReducer, useMemo } from "react";
import UserList from "./UserList";
import CreateUser from "./CreateUser";
import produce from "immer";

function countActiveUsers(users) {
  console.log("활성 사용자 수를 세는중...");
  return users.filter((user) => user.active).length;
}

const initialState = {
  users: [
    {
      id: 1,
      username: "velopert",
      email: "public.velopert@gmail.com",
      active: true,
    },
    {
      id: 2,
      username: "tester",
      email: "tester@example.com",
      active: false,
    },
    {
      id: 3,
      username: "liz",
      email: "liz@example.com",
      active: false,
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "CREATE_USER":
      return produce(state, (draft) => {
        draft.users.push(action.user);
      });

    case "TOGGLE_USER":
      return produce(state, (draft) => {
        const user = draft.user.find((user) => user.id === action.id);
        user.active = !user.active;
      });

    case "REMOVE_USER":
      return produce(state, (draft) => {
        const index = draft.users.findIndex((user) => user.id === action.id);
        draft.users.splice(index, 1);
      });

    default:
      return state;
  }
}

// userDispatch 라는 이름으로 내보냄
export const UserDispatch = React.createContext(null);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { users } = state;

  const count = useMemo(() => countActiveUsers(users), [users]);

  return (
    <UserDispatch.Provider value={dispatch}>
      <CreateUser />
      <UserList users={users} />
      <div>활성사용자 수 : {count}</div>
    </UserDispatch.Provider>
  );
}

export default App;
