import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Distributor from "./pages/DistributorPage/Distributor.js";
import Overview from "./pages/OverviewPage/Overview.js";
import ProductCatalogue from "./pages/ProductCataloguePage/ProductCatalogue.js";
import Mapping from "./pages/MappingPage/Mapping.js";
import Manufacturer from "./pages/ManufacturerPage/Manufacturer.js";
import Retailer from "./pages/RetailerPage/Retailer.js";
import Login from "./pages/LoginPage/login.jsx";
import OTPVerification from "./pages/LoginPage/OTPVerification.jsx";
import ProfileItemsInfo from "./components/ProfileItems/ProfileItemsInfo.js";
import { AuthProvider } from "./components/Context/authContext.js";
import ManufacturerInfo from "./components/ManufacturerItems/ManufacturerItemsInfo.js";
import AddManufacturer from "./components/AddManufacture/Addmanu.js";
import ManufacturerList from "./pages/ManufacturerPage/Manufacturer.js";
import DistributorCNF from "./components/Distributor/DistributorCNF.js";
import DistributorCNFdetails from "./components/Distributor/DistributorCNFdetails.js";
import Distributorlist from "./components/Distributor/Distributorlist.js";
import AddDistributor from "./components/Distributor/AddDistributor.js";
import RetailerSummary from "./components/Retailer/RetailerSummary.js";
import RetailerProfile from "./components/Retailer/RetailerProfile.js";
import AddRetailer from "./components/Retailer/AddRetailer.js";
import RetailerList from "./components/Retailer/Retailerlist.js";
import MappingSummary from "./components/MappingItems/MappingSummary.js";
import BulkUploadData from "./components/ProductCatalogueItems/BulkUploadData.js";
import AddProductForm from "./components/ProductCatalogueItems/AddProductForm.js";
import Mappingmap from "./components/MappingItems/Mappingmap.js";
import Editproduct from "./components/ProductCatalogueItems/Edit product.js";
import Footer from "./components/footer.js";
import Hospital from "./pages/HospitalPage/Hospital.jsx";
import HospitalDetails from "./pages/HospitalPage/HospitalDetails.jsx";
import AddHospital from "./pages/HospitalPage/AddHospital.jsx";
import BackgroundVersionService from "./components/Version_Control/BackgroundVersionService";
import HSN from "./pages/HSN_Page/hsn.jsx";
import Add_HSN_Code from "./components/HSN_Code/Add_HSN.js";
import Edit_HSN from "./components/HSN_Code/Edit_HSN.js";
import ProfileImage from "./components/ProfileElements/GeneralDetails/ProfileImage.js";
import SubscriptionsInfo from "./components/Subscription/SubscriptionInfo.js";
import AddSubscription from "./components/Subscription/AddSubscription.js";
import EditSubscription from "./components/Subscription/EditSubscription.js";
import Adsinfo from "./components/adsData/adsinfo.js";
import AddAdvertisement from "./components/adsData/AddAdvertisement.js";
import EditAdvertisement from "./components/adsData/EditAdvertisement";
import RolePage from "./pages/RolePage/rolePage.jsx";
import SubscriptionsPage from "./pages/SubscriptionsPage/SubscriptionsPage.jsx";
import Affiliate from "./pages/AffiliatePage/Affiliate.jsx";
import AffiliateDetails from "./pages/AffiliatePage/AffiliateDetails.jsx";
import BusinessDetails from "./pages/BusinessDetailsPage/BusinessDetails.jsx";
import AddDistributorCnf from "./pages/BusinessDetailsPage/AddDistributorCnf.jsx";
import AddSupplierMfr from "./pages/BusinessDetailsPage/AddSupplierMfr.jsx";
import Coupons from "./pages/CouponsPage/Coupons.jsx";
import CouponsDetails from "./pages/CouponsPage/CouponsDetails.jsx"
// import VersionChecker from './components/Version_Control/VersionChecker.js';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <BackgroundVersionService />
          <Routes>
            <Route path="/ProfileImage" element={<ProfileImage />} />
            <Route path="/Datalist" element={<Manufacturer />} />
            <Route
              path="/product-catalogue/AddProductForm"
              element={<AddProductForm />}
            />
            <Route path="/BulkUploadData" element={<BulkUploadData />} />
            <Route
              path="/distributors/AddDistributor"
              element={<AddDistributor />}
            />
            <Route
              path="/retailers/RetailerProfile/:id"
              element={<RetailerProfile />}
            />
            <Route path="/Retailer" element={<RetailerSummary />} />
            <Route path="/Distributorlist" element={<Distributorlist />} />
            <Route
              path="/distributors/DistributorCNFdetails/:id"
              element={<DistributorCNFdetails />}
            />
            <Route path="/DistibutorCNF" element={<DistributorCNF />} />
            <Route
              path="/manufacturers/add-manufacturer"
              element={<AddManufacturer />}
            />
            <Route path="/manufacturers" element={<ManufacturerList />} />
            <Route path="/" element={<Login />} />
            <Route path="/confirmation" element={<OTPVerification />} />
            <Route path="/overview" element={<Overview />} />
            <Route
              path="/manufacturers/ProfileItemsInfo/:id"
              element={<ProfileItemsInfo />}
            />
            <Route path="/ManufactureItemInfo" element={<ManufacturerInfo />} />
            <Route
              path="/manufacturers/profile/:id"
              element={<Manufacturer />}
            />
            <Route path="/distributors" element={<Distributor />} />
            <Route path="/retailers" element={<Retailer />} />
            <Route path="/RetailerList" element={<RetailerList />} />
            <Route path="/retailers/AddRetailer" element={<AddRetailer />} />
            <Route
              path="/product-catalogue/Editproduct/:id"
              element={<Editproduct />}
            />
            <Route path="/product-catalogue" element={<ProductCatalogue />} />
            <Route path="/mapping" element={<Mapping />} />
            <Route path="/MappingSummary" element={<MappingSummary />} />
            <Route path="/mapping/Mappingmap/:id" element={<Mappingmap />} />
            <Route path="/hospitals" element={<Hospital />} />
            <Route
              path="/hospitals/HospitalsDetails/:id"
              element={<HospitalDetails />}
            />
            <Route path="/hospitals/add-hospital" element={<AddHospital />} />
            <Route path="/hsn" element={<HSN />} />
            <Route path="/hsn/add_hsn_code" element={<Add_HSN_Code />} />
            <Route path="/hsn/edit_hsn_code/:id" element={<Edit_HSN />} />
            <Route
              path="/Subscriptions-status"
              element={<SubscriptionsInfo />}
            />
            <Route
              path="/Subscriptions-status/add-Subscription"
              element={<AddSubscription />}
            />
            <Route
              path="/Subscriptions-status/edit-Subscription"
              element={<EditSubscription />}
            />
            <Route path="/ads-menu" element={<Adsinfo />} />
            <Route
              path="/ads-menu/add-new-ads"
              element={<AddAdvertisement />}
            />
            <Route
              path="/ads-menu/advertisements/:id"
              element={<EditAdvertisement />}
            />
            <Route path="/distributors/rolePage/:id" element={<RolePage />} />
            <Route path="/manufacturers/rolePage/:id" element={<RolePage />} />
            <Route
              path="/manufacturers/ProfileItemsInfo/:id/SubscriptionsPage"
              element={<SubscriptionsPage />}
            />
            <Route
              path="/distributors/DistributorCNFdetails/:id/SubscriptionsPage"
              element={<SubscriptionsPage />}
            />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/affiliate/:id" element={<AffiliateDetails />} />
            <Route
              path="/distributors/business-details/:id"
              element={<BusinessDetails />}
            />
            <Route
              path="/distributors/business-details/:id/add-supplierDis-CNF"
              element={<AddDistributorCnf />}
            />
            <Route
              path="/distributors/business-details/:id/add-supplierMfr"
              element={<AddSupplierMfr />}
            />

            <Route path="/coupons" element={<Coupons />} />
            <Route path="/coupons/:id" element={<CouponsDetails />} />

            {/* {/* <Route path="/Version" element={<VersionChecker />} /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
