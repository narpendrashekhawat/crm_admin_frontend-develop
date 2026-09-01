import { Box, Button } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Config } from "../Utils/Config";
import { useAuth } from "../Context/authContext";

const CSVDownload = ({headerId}) => {
  const { authToken, userId } = useAuth();
  const [mappedData, setMappedData] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  console.log(authToken, 'downloadAuth')
  
    const handleExportCSV = async()=>{
        try{
            const response = await axios.get(`${Config?.CSV_download}/${headerId}`,{headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        if(response?.status === 200){
             setMappedData(response?.data?.data);
             setFileUrl(response?.data?.header?.[0]?.fileName || "");
        }
        }catch(error){
            console.log(error, 'Error in fetching api response')
        }
    }

    useEffect(()=>{
        if(authToken){
            handleExportCSV()
        }
    },[authToken])

    const downloadCSV = () => {
        if (mappedData.length === 0) return;
    
        // Extract headers from the first object
        const headers = Object.keys(mappedData[0]);
    
        // Convert data array to CSV format
        const csvRows = [];
        csvRows.push(headers.join(",")); 
    
        mappedData.forEach((item) => {
          const values = headers.map((header) => {
            let val = item[header];
            return typeof val === "string" ? `${val}` : val; 
          });
          csvRows.push(values.join(","));
        });
    
        const csvContent = csvRows.join("\n");
    
        // Create a blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Mapped Stock.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      const downloadHeaderFile = () => {
        if (!fileUrl) return;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = 'Uploaded Stock.csv'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      const handleDownloadAll = () => {
        downloadCSV(); 
        setTimeout(() => downloadHeaderFile(), 800); 
      };
    return (
        <>
            <Button w='192px' backgroundColor="#3E60AA" height='36px' rounded='6px' color="#ffffff" fontSize="14px" fontWeight='500' onClick={handleDownloadAll} _hover={{opacity: 0.9}}>
                Preview
            </Button>
        </>
    )
}

export default CSVDownload