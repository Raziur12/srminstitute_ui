import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../../interceptor/axiosInstance";

const GenerateLinkButton = ({ test_id }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("assessments/link/", { test_id });
      if (response.data?.status === "success" && response.data.data?.link) {
        const link = response.data.data.link;

        Swal.fire({
          title: "Link Generated!",
          text: "Click the button below to copy the link.",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "Copy Link",
        }).then((result) => {
          if (result.isConfirmed) {
            navigator.clipboard.writeText(link);
            Swal.fire("Copied!", "The link has been copied to your clipboard.", "success");
          }
        });
      } else {
        Swal.fire("Error", "Unexpected response format.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Something went wrong!", "error");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleGenerateLink}
      className="bg-blue-500 text-white px-4 py-2 rounded"
      disabled={loading}
    >
      {loading ? "Generating..." : "Generate"}
    </button>
  );
};

export default GenerateLinkButton;
