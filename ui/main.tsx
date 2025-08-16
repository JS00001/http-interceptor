import React from "react";
import ReactDOM from "react-dom/client";

import "@ui/styles/main.css";
import "@ui/styles/table.css";
import Routes from "@ui/routes";
import Error404 from "@ui/pages/404";
import useRouter from "@ui/store/router";
import Layout from "@ui/components/Layout";

function Main() {
  // useGlobalHotkey("CommandOrControl+Shift+U", () => {
  //   writeText("Hello, world!");
  // });

  return (
    <React.StrictMode>
      <Layout>
        <Router />
      </Layout>
    </React.StrictMode>
  );
}

function Router() {
  const pathname = useRouter((s) => s.pathname);
  const Page = Routes[pathname] ?? Error404;

  return <Page />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<Main />);
