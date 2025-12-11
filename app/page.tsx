"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// CONFIGURATION
const CONTRACT_ADDRESS = "0x601E3BaD2A304c86A271CE13dcd187A450c9Dd29"; 
// Start with 10 for demo speed, or fetch totalSupply() if you want to be advanced
const COLLECTION_SIZE = 10; 
const BASE_URI = "https://orange-additional-whippet-196.mypinata.cloud/ipfs/bafybeigbphpzru4h323dfqh7asdopkpyphkl4dvnknp7xltikdxvuelk2a/";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");

  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, programFilter, nfts]);

  const fetchNFTs = async () => {
    let tempNfts = [];
    // In a real prod env, we would use Alchemy/Infura API to fetch these efficiently
    // For this demo, we fetch the JSONs directly from IPFS gateway
    for (let i = 1; i <= COLLECTION_SIZE; i++) {
      try {
        const response = await fetch(`${BASE_URI}${i}.json`);
        const metadata = await response.json();
        
        // Convert IPFS image link to Gateway link for display
        const imgLink = metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
        
        tempNfts.push({
            id: i,
            name: metadata.attributes.find(a => a.trait_type === "Student Name").value,
            program: metadata.attributes.find(a => a.trait_type === "Program").value,
            grade: metadata.attributes.find(a => a.trait_type === "Grade").value,
            image: imgLink
        });
      } catch (err) {
        console.error("Error fetching NFT", i, err);
      }
    }
    setNfts(tempNfts);
    setFilteredNfts(tempNfts);
  };

  const filterData = () => {
    let result = nfts;

    // Search Logic
    if (searchTerm) {
      result = result.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Dropdown Logic
    if (programFilter !== "All") {
      result = result.filter(nft => nft.program === programFilter);
    }

    setFilteredNfts(result);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Graduate Certificate Gallery</h1>
      
      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <input 
          type="text" 
          placeholder="Search by Student Name..." 
          className="p-3 rounded border border-gray-300 w-full md:w-1/3 text-black"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="p-3 rounded border border-gray-300 text-black"
          onChange={(e) => setProgramFilter(e.target.value)}
        >
          <option value="All">All Programs</option>
          <option value="Blockchain 101">Blockchain 101</option>
          <option value="Advanced Solidity">Advanced Solidity</option>
          <option value="DeFi Mastery">DeFi Mastery</option>
          <option value="NFT Architecture">NFT Architecture</option>
        </select>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredNfts.map((nft) => (
          <div key={nft.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{nft.name}</h2>
              <p className="text-gray-600">Program: {nft.program}</p>
              <div className="mt-2 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                Grade: {nft.grade}
              </div>
              <a 
                href={`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${nft.id}`} 
                target="_blank" 
                className="block mt-4 text-center text-blue-500 hover:underline"
              >
                View on OpenSea
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}