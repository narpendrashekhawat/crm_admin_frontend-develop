

import { Box, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar.js";
import HeaderBar from "../../components/Header/HeaderBar.js";
import ProfileItemsInfo from "../../components/ProfileItems/ProfileItemsInfo.js";

import generalData from "../../dummy-data/Profile/GeneralDetails.json";
import subscriptionsData from "../../dummy-data/Profile/Subscriptions.json";
import entitiesData from "../../dummy-data/Profile/Entities.json";
import productCatalogueData from "../../dummy-data/Profile/ProductCatalogues.json";
import addressData from "../../dummy-data/Profile/Address.json"
import documentsData from "../../dummy-data/Profile/DocumentsUpload.json"
import invoiceData from "../../dummy-data/Profile/Invoice.json"
import bankData from "../../dummy-data/Profile/BankDetails.json";




const Profile = () => {
    const token = localStorage.getItem("authToken");
    console.log(token);

    const [generalDetails, setGeneralDetails] = useState({});
    const [subscriptions, setSubscriptions] = useState([]);
    const [entities, setEntities] = useState([]);
    const [productCatalogues, setProductCatalogues] = useState({});
    const [address, setAddress] = useState({});
    const [documents, setDocuments] = useState({});
    const [invoice, setInvoice] = useState({});
// Bank state
const [bankDatas, setBankDatas] = useState({ 
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  ifsc: ""
});

// Handler function to update bank data
const handleBankChange = (field, value) => {
  setBankDatas(prev => ({
    ...prev,
    [field]: value
  }));
};


    useEffect(() => {
        setGeneralDetails(generalData[0] || {});
        setSubscriptions(subscriptionsData);
        setEntities(entitiesData);
        setProductCatalogues(productCatalogueData[0] || {});
        setAddress(addressData);
        setDocuments(documentsData);
        setInvoice(invoiceData);
        setBankDatas(bankData);
    }, []);

    return (
        <Box backgroundColor='#F0F4F9' height={"100%"}>
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='80%'>
                    <HeaderBar />
                    <ProfileItemsInfo
                        GeneralDetailsObj={generalDetails}
                        Invoiceobj={invoice}
                        BankObj={bankDatas}       
                        SubscriptionsObj={subscriptions}
                        EntitiesObj={entities}
                        ProductCatalogueObj={productCatalogues}
                        AddressesObj={{}}
                        DocumentsUploadObj={documents}
                        onBankChange={handleBankChange} 
                    />
                </Box>
            </HStack>
        </Box>
    );
};

export default Profile;

