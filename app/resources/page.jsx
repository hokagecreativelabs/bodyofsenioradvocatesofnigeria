"use client"
import { useState } from "react";
import { FaFilePdf, FaEye, FaDownload } from "react-icons/fa";

const resources = [
  { id: 1, title: "A Speech By The Honourable Chief Justice Of Nigeria", url: "/Resources/A-Speech-By-The-Honourable-Chief-Justice-Of-Nigeria.pdf" },
  { id: 2, title: "A Speech By The President Of The Nigerian Bar Association", url: "/Resources/A-Speech-By-The-President-Of-The-Nigerian-Bar-Association.pdf" },
  { id: 3, title: "Address Presented Elder C.A.N Nwokeukwu-SAN", url: "/Resources/Address-Presented-Elder-C.A.N-Nwokeukwu-SAN.pdf" },
  { id: 4, title: "Leadership: Bridging the Gap Between Expectation and Performance", url: "/Resources/LEADERSHIP-BRIDGING-THE-GAP-BETWEEN-EXPECTATION-AND -PERFORMANCE.pdf" },
  { id: 5, title: "Paper by Hon. Justice Ejembi Eko, JSC, at the Induction Programme for the 2021 Senior Advocates", url: "/Resources/PAPER-BY-HON-JUSTICE-EJEMBI-EKO-JSC-AT-THE-INDUCTION-PROGRAMME-FOR-THE-2021-SENIOR-ADVOCATES.pdf" },
  { id: 6, title: "Paper presented by Chief Folake Solanke, SAN", url: "/Resources/Paper-Presented-by-Chief-Folake-Solanke-SAN(1).pdf" },
  { id: 7, title: "The Pre-Swearing Induction Programme – December 1, 2021.", url: "/Resources/THE-PRE-SWEARING-INDUCTION-PROGRAMME-DECEMBER-1-2021.pdf" },
  { id: 8, title: "Bosan Ethics Committee Guidelines Procedural Rules 2023", url: "/Resources/BOSAN-ETHICS-COMMITTEE-GUIDELINES-PROCEDURAL-RULES-2023.pdf" },
  { id: 9, title: "Code of Dressing for Senior Advocates of Nigeria", url: "/Resources/CODE-OF-DRESSING-SAN.pdf" },
];

export default function ResourcesPage() {
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold text-[#0F2C59] mb-4">BOSAN Resources</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search resources..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D3C42]"
      />

      {/* Resource Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="border rounded-xl p-4 shadow-md bg-white flex items-center gap-4"
            >
              <FaFilePdf className="text-red-500 text-4xl" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{res.title}</h3>
              </div>
              <div className="flex gap-3">
                <a href={res.url} target="_blank" rel="noopener noreferrer" title="View">
                  <FaEye className="text-[#3D3C42] hover:text-[#3F2E3E] text-xl" />
                </a>
                <a href={res.url} download title="Download">
                  <FaDownload className="text-[#3D3C42] hover:text-[#3F2E3E] text-xl" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No resources found.</p>
        )}
      </div>
    </div>
  );
}
