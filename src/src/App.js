import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Distributor from './pages/DistributorPage/Distributor.js';
import Overview from './pages/OverviewPage/Overview.js';
import ProductCatalogue from './pages/ProductCataloguePage/ProductCatalogue.js';
import Mapping from './pages/MappingPage/Mapping.js';
import Manufacturer from './pages/ManufacturerPage/Manufacturer.js';
import Retailer from './pages/RetailerPage/Retailer.js';
import Login from "./pages/LoginPage/login.jsx";
import OTPVerification from "./pages/LoginPage/OTPVerification.jsx";
import ProfileItemsInfo from './components/ProfileItems/ProfileItemsInfo.js';
import { AuthProvider } from './components/Context/authContext.js';
import ManufacturerInfo from './components/ManufacturerItems/ManufacturerItemsInfo.js';
import AddManufacturer from "./components/AddManufacture/Addmanu.js";
import ManufacturerList from './pages/ManufacturerPage/Manufacturer.js';
import DistributorCNF from './components/Distributor/DistributorCNF.js';
import DistributorCNFdetails from './components/Distributor/DistributorCNFdetails.js';
import Distributorlist from './components/Distributor/Distributorlist.js';
import AddDistributor from './components/Distributor/AddDistributor.js';
import RetailerSummary from './components/Retailer/RetailerSummary.js';
import RetailerProfile from './components/Retailer/RetailerProfile.js';
import AddRetailer from './components/Retailer/AddRetailer.js';
import RetailerList from './components/Retailer/Retailerlist.js';
import MappingSummary from './components/MappingItems/MappingSummary.js';
import BulkUploadData from './components/ProductCatalogueItems/BulkUploadData.js';
import AddProductForm from './components/ProductCatalogueItems/AddProductForm.js';
import Mappingmap from './components/MappingItems/Mappingmap.js';
import Footer from './components/footer.js';


function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/Datalist' element={<Manufacturer />} />
            <Route path='/AddProductForm' element={<AddProductForm />} />
            <Route path='/BulkUploadData' element={<BulkUploadData />} />
            <Route path='/AddDistributor' element={<AddDistributor />} />
            <Route path='/RetailerProfile/:id' element={<RetailerProfile />} />
            <Route path='/Retailer' element={<RetailerSummary />} />
            <Route path='/Distributorlist' element={<Distributorlist />} />
            <Route path='/DistributorCNFdetails/:id' element={<DistributorCNFdetails />} />
            <Route path='/DistibutorCNF' element={<DistributorCNF />} />
            <Route path='/manufacturers/add-manufacturer' element={<AddManufacturer />} />
            <Route path='/manufacturers' element={<ManufacturerList />} />
            <Route path="/" element={<Login />} />
            <Route path="/confirmation" element={<OTPVerification />} />
            <Route path='/overview' element={<Overview />} />
            <Route path='/ProfileItemsInfo/:id' element={<ProfileItemsInfo />} />
            <Route path='/ManufactureItemInfo' element={<ManufacturerInfo />} />
            <Route path='/manufacturers/profile/:id' element={<Manufacturer />} />
            <Route path='/distributors' element={<Distributor />} />
            <Route path='/retailers' element={<Retailer />} />
            <Route path='/RetailerList' element={<RetailerList />} />
            <Route path='/AddRetailer' element={<AddRetailer />} />
            <Route path='/product-catalogue' element={<ProductCatalogue />} />
            <Route path='/mapping' element={<Mapping />} />
            <Route path='/MappingSummary' element={<MappingSummary />} />
            <Route path="/Mappingmap/:id" element={<Mappingmap />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
