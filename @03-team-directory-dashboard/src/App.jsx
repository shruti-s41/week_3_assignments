import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  let filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.company.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  filteredUsers.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return a.company.name.localeCompare(b.company.name);
    }
  });

  return (
    <div className="app">
      <h1>Team Directory</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or company"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button
          onClick={() => {
            if (sortBy === "name") {
              setSortBy("company");
            } else {
              setSortBy("name");
            }
          }}
        >
          Sort by {sortBy === "name" ? "Company" : "Name"}
        </button>
      </div>

      <div className="content">
        <div className="users">
          <h2>Team Members</h2>

          <div className="user-grid">
            {filteredUsers.map((user) => (
              <div
                className="user-card"
                key={user.id}
                onClick={() => setSelectedUser(user)}
              >
                <h3>{user.name}</h3>
                <p>{user.company.name}</p>
                <p>{user.email}</p>
                <p>{user.address.city}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedUser && <UserDetails user={selectedUser} />}
      </div>
    </div>
  );
}

// user details

function UserDetails({ user }) {
  const [posts, setPosts] = useState([]);
  const [todos, setTodos] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [todosLoading, setTodosLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    setPostsLoading(true);
    setTodosLoading(true);
    setPosts([]);
    setTodos([]);

    fetch(
      "https://jsonplaceholder.typicode.com/posts?userId=" + user.id
    )
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setPosts(data);
          setPostsLoading(false);
        }
      });

    fetch(
      "https://jsonplaceholder.typicode.com/todos?userId=" + user.id
    )
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setTodos(data);
          setTodosLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user.id]);

  let completedTodos = todos.filter((todo) => todo.completed).length;
  let pendingTodos = todos.filter((todo) => !todo.completed).length;

  let percentComplete = 0;

  if (todos.length > 0) {
    percentComplete = Math.round(
      (completedTodos / todos.length) * 100
    );
  }

  return (
    <div className="details">
      <h2>{user.name}</h2>
      <p>{user.company.name}</p>
      <p>{user.email}</p>
      <p>{user.address.city}</p>

      {/* posts */}

      <h2>Posts</h2>

      {postsLoading ? (
        <p>Loading posts...</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div className="post" key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* todos */}

      <h2>Todos</h2>

      {todosLoading ? (
        <p>Loading todos...</p>
      ) : (
        <div>
          <p>
            Completed: {completedTodos} | Pending: {pendingTodos}
          </p>

          <p>Percent complete: {percentComplete}%</p>

          {todos.map((todo) => (
            <div className="todo" key={todo.id}>
              <span>
                {todo.completed ? "Completed" : "Pending"} - {todo.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
