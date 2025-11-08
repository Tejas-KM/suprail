import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProjects, downloadProjectsByDate, getProjectById } from "../api/project";
import debounce from "lodash/debounce";
import { getCurrentUser } from "../api/auth";
import { downloadProjectExcelReport } from "../utils/excelReport";

const PipeDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        setCurrentUser(null);
      }
    }
    fetchUser();
  }, []);


  // Date range filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [downloadDate, setDownloadDate] = useState("");
  const [downloading, setDownloading] = useState(false);

  const [excelDownloading, setExcelDownloading] = useState(false);

  // Download Excel for all projects in date range
  const handleDownloadExcelByDate = async () => {
    if (!fromDate && !toDate) return;
    setExcelDownloading(true);
    try {
      const response = await import('../api/project').then(mod => mod.downloadProjectsExcelByDate({ from: fromDate, to: toDate }));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `projects_report_${fromDate || ''}_${toDate || ''}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("No projects found or download failed.");
    } finally {
      setExcelDownloading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!downloadDate) return;
    setDownloading(true);
    try {
      const response = await downloadProjectsByDate(downloadDate);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `projects_${downloadDate}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("No projects found or download failed.");
    } finally {
      setDownloading(false);
    }
  };

  // Filter projects by date range
  const handleDateFilter = async () => {
    const params = {
      page: 1,
      limit: itemsPerPage,
      search: searchQuery,
      from: fromDate,
      to: toDate,
    };
    setCurrentPage(1);
    setSearchParams({ search: searchQuery, page: "1", from: fromDate, to: toDate });
    await fetchSessions(params);
  };

  // Sessions, search, pagination
  const [pipeSessions, setPipeSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 16;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchSessions = async ({ page, search, from, to }) => {
    const data = await getProjects({ page, limit: itemsPerPage, search, from, to });
    setPipeSessions(data?.data || []);
    setTotalItems(data?.total || 0);
  };

  useEffect(() => {
    fetchSessions({ page: currentPage, search: searchQuery, from: fromDate, to: toDate });
  }, [currentPage, fromDate, toDate, searchQuery]);

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setCurrentPage(1);
        setSearchParams({ search: query, page: "1", from: fromDate, to: toDate });
        fetchSessions({ page: 1, search: query, from: fromDate, to: toDate });
      }, 400),
    [setSearchParams, fromDate, toDate]
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setSearchParams({ search: searchQuery, page: page.toString() });
  };

  return (
    <div className="bg-gray-100 p-6 mt-12">
      {/* Brand & Welcome */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Supreme Dashboard</h1>
        <p className="text-gray-600 mt-1">Pipe Counter AI – Visual Project Log</p>
      </div>

      {/* CTA Card */}
      <div className="mb-8">
        <div className="bg-linear-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Create New Pipe Count</h2>
          <p className="text-sm mb-4">Capture a new image to upload and count pipes via AI.</p>
          <button
            className="bg-white text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => navigate("/analyze")}
          >
            + Upload / Capture Image
          </button>
        </div>
      </div>

      {/* Unified Search, Date Range, and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search projects by name..."
          className="w-full sm:w-80 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-wrap gap-2 items-center w-full">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-2 py-2 rounded-md border border-gray-300 shadow-sm"
            placeholder="From"
          />
          <span className="mx-1">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-2 py-2 rounded-md border border-gray-300 shadow-sm"
            placeholder="To"
          />
          <button
            onClick={handleDateFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            disabled={!fromDate && !toDate}
          >
            Filter
          </button>
          <button
            onClick={handleDownloadExcelByDate}
            className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto"
            disabled={excelDownloading || (!fromDate && !toDate)}
          >
            {excelDownloading ? "Downloading Excel..." : "Download Excel"}
          </button>
          <button
            onClick={async () => {
              setDownloading(true);
              try {
                // Use from/to for zip download
                const response = await import('../api/project').then(mod => mod.downloadProjectsByDate({ from: fromDate, to: toDate }));
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `projects_${fromDate || ''}_${toDate || ''}.zip`);
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (err) {
                alert("No projects found or download failed.");
              } finally {
                setDownloading(false);
              }
            }}
            disabled={downloading || (!fromDate && !toDate)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto"
          >
            {downloading ? "Downloading..." : "Download Report"}
          </button>
        </div>
      </div>

      {/* Past Sessions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Pipe Count Sessions
        </h3>

        {pipeSessions.length === 0 ? (
          <p className="text-gray-500">No sessions found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {pipeSessions.map((session) => (
              <div
                key={session._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-800">{session.name}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                  <button
                    className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                    onClick={() => navigate(`/project/${session._id}`)}
                  >
                    View Details →
                  </button>
                  {/*
                  <button
                    className="mt-2 text-green-600 hover:underline text-sm font-medium block"
                    onClick={async () => {
                      try {
                        const project = await getProjectById(session._id);
                        downloadProjectExcelReport({ project, user: currentUser });
                      } catch (err) {
                        alert("Failed to download Excel report.");
                      }
                    }}
                  >
                    Download Excel
                  </button>
                  */}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-1 flex-wrap">
            {currentPage > 1 && (
              <button
                onClick={() => goToPage(currentPage - 1)}
                className="px-3 py-2 rounded-md text-sm border bg-white hover:bg-gray-100 text-gray-700"
              >
                ← Prev
              </button>
            )}

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium border ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (
                (page === currentPage - 3 && page > 2) ||
                (page === currentPage + 3 && page < totalPages - 1)
              ) {
                return (
                  <span key={page} className="px-2 py-2 text-gray-500 select-none">
                    ...
                  </span>
                );
              }
              return null;
            })}

            {currentPage < totalPages && (
              <button
                onClick={() => goToPage(currentPage + 1)}
                className="px-3 py-2 rounded-md text-sm border bg-white hover:bg-gray-100 text-gray-700"
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PipeDashboard;
