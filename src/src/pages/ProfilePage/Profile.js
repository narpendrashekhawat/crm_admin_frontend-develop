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

const Profile = () => {
    const token = localStorage.getItem("authToken");
    console.log(token);

    const [generalDetails, setGeneralDetails] = useState({});
    const [subscriptions, setSubscriptions] = useState([]);
    const [entities, setEntities] = useState([]);
    const [productCatalogues, setProductCatalogues] = useState({});
    const [address, setAddress] = useState({});
    const [documents, setDocuments] = useState({});

    useEffect(() => {
        setGeneralDetails(generalData[0] || {});
        setSubscriptions(subscriptionsData);
        setEntities(entitiesData);
        setProductCatalogues(productCatalogueData[0] || {});
        setAddress(addressData);
        setDocuments(documentsData);
    }, []);

    return (
        <Box backgroundColor='#F0F4F9' height={"100%"}>
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='80%'>
                    <HeaderBar />
                    <ProfileItemsInfo
                        GeneralDetailsObj={generalDetails}
                        SubscriptionsObj={subscriptions}
                        EntitiesObj={entities}
                        ProductCatalogueObj={productCatalogues}
                        AddressesObj={{}}
                        DocumentsUploadObj={documents}
                    />
                </Box>
            </HStack>
        </Box>
    );
};

export default Profile;
