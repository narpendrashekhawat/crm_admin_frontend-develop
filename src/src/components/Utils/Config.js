import DistributorCNFdetails from "../Distributor/DistributorCNFdetails";
import Distributorlist from "../Distributor/Distributorlist";
import AddProductForm from "../ProductCatalogueItems/AddProductForm";
import BulkUploadData from "../ProductCatalogueItems/BulkUploadData";
import AddRetailer from "../Retailer/AddRetailer";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;
const CSV_URL = `${process.env.REACT_APP_CSV_URL}`;
console.log(BASE_URL,CSV_URL, 'baseurllll')

export const Config = {
    Login_url: `${BASE_URL}api/login`,
    OTPVerification_url: `${BASE_URL}api/verify-otp`,
    ManufactureProfile_url: `${BASE_URL}api/manufacturers/details`,
    DataList_url: `${BASE_URL}api/manufacturers`,
    ManufactureCards_url: `${BASE_URL}api/manufacturers/stats`,
    AddManufacturer_url: `${BASE_URL}api/manufacturers/register`,
    ProfileItemsInfo_url: `${BASE_URL}api/manufacturers/details`,
    Distributorlist_url: `${BASE_URL}api/distributors`,
    DistributorCards_url: `${BASE_URL}api/distributors/stats`,
    AddDistributor_url: `${BASE_URL}api/distributors/register`,
    DistributorCNFdetails_url: `${BASE_URL}api/distributors/details`,
    AddRetailer_url: `${BASE_URL}api/retailers/register`,
    Retailerlist_url: `${BASE_URL}api/retailers`,
    RetailerCard_url: `${BASE_URL}api/retailers/stats`,
    RetailerProfile_url: `${BASE_URL}api/retailers/details`,
    AddProductForm_url: `${BASE_URL}api/products/register`,
    ProductSummary_url: `${BASE_URL}api/products`,
    Get_Company_Name: `${BASE_URL}api/manufacturers`,
    Get_Manufaturers_Mapping_List: `${BASE_URL}api/productMapping/headers`,
    Get_Mapping_details: `${BASE_URL}api/productMapping/mapManufacturerNames`,
    Get_Manufaturers_List: `${BASE_URL}api/manufacturerMapSearch`,
    Add_Manufacturer: `${BASE_URL}api/manufaturerAdd`,
    Manufacturer_mapp: `${BASE_URL}api/manufacturerMapp`,
    Get_Product_Mapping_List: `${BASE_URL}api/productMapping/mapProductName`,
    Get_Product_Map_Search: `${BASE_URL}api/productMapSearch`,
    Add_New_Product: `${BASE_URL}api/addMapProduct`,
    ProductCard_url: `${BASE_URL}api/products/stats`,
    Add_Map_Product: `${BASE_URL}api/productMap`,
    CSV_download: `${BASE_URL}api/stockMapping/downloadStock`,
    Map_Stock: `${BASE_URL}api/stockMapping/mapStock`,
    BulkUploadData_url: `${CSV_URL}upload-products`
}