import React from "react";
import ReactDOM from "react-dom/client";

import "@ui/styles/main.css";
import "@ui/styles/table.css";
import Routes from "@ui/routes";
import Error404 from "@ui/pages/404";
import useRouter from "@ui/store/router";
import Layout from "@ui/components/Layout";
import { BrowserProvider } from "@ui/providers/browser";

function Main() {
  return (
    <React.StrictMode>
      <BrowserProvider>
        <Layout>
          <Router />
        </Layout>
      </BrowserProvider>
    </React.StrictMode>
  );
}

function Router() {
  const pathname = useRouter((s) => s.pathname);
  const Page = Routes[pathname] ?? Error404;

  return <Page />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<Main />);
