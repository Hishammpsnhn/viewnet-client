import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import GenericTable from "../../components/GenericTable";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoadingSpinner from "../../components/LoadingSpinner";
import { GETPaymentHistory_API } from "../../api/PlansApi";

interface Payment {
  _id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPage, setMaxPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setLoading(true);
      try {
        const res = await GETPaymentHistory_API(page, 5, searchQuery);
        if (res.data ) {
            console.log(res.data);
          // Transform Stripe response to match Payment interface
          const transformedData = res.data.map((transaction: any) => ({
            _id: transaction.id,
            email: transaction.description || "N/A", // Use description or default to "N/A"
            amount: transaction.amount / 100, // Convert amount to dollars if necessary
            currency: transaction.currency,
            status: transaction.status,
            createdAt: new Date(transaction.created * 1000).toISOString(), // Convert timestamp to ISO format
          }));
          console.log(transformedData)
          setPayments(transformedData);
        //  setMaxPage(res.data.total_pages || 1); // Assuming the response includes total_pages
        } else {
          toast.error("Failed to fetch payment history.");
        }
      } catch (error) {
        toast.error("Error fetching payment history.");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentHistory();
  }, [page, searchQuery]);

  const columns: Column<Payment>[] = [
    { header: "Payment ID", accessor: "_id" },
    { header: "Email", accessor: "email" },
    { header: "Amount", accessor: (payment: Payment) => `${payment.amount} ${payment.currency}` },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: (payment: Payment) => new Date(payment.createdAt).toLocaleString() },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      <div className="flex gap-4 mb-4">
        <div className="search-container flex-1">
          <input
            type="text"
            placeholder="Search by email..."
            className="bg-black border-secondary p-2 text-lg my-5 border rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <GenericTable<Payment> data={payments} columns={columns} />
      )}

      <div className="flex justify-end mt-5">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`bg-slate-400 p-2 rounded-sm mr-3 ${page <= 1 && "opacity-60"}`}
        >
          <IoIosArrowBack />
        </button>
        <button
          disabled={page === maxPage}
          onClick={() => setPage((prev) => prev + 1)}
          className={`bg-slate-400 p-2 rounded-sm ${page === maxPage && "opacity-60"}`}
        >
          <IoIosArrowForward />
        </button>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default PaymentHistory;
