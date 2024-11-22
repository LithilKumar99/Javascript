import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-treeview/react-treeview.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
import 'datatables.net';
import 'react-datepicker/dist/react-datepicker.css';

import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

if (!root.isMounted) {
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
} else {
  root.render(
    <QueryClientProvider client={queryClient}>
      <UpdatedApp />
    </QueryClientProvider>
  );
}

