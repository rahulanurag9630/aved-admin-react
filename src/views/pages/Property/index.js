import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import Topheading from "src/component/TopHeading";
import { useHistory, useLocation } from "react-router-dom";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import useDebounce from "src/component/customHook/Debounce";
import { formatDate } from "../../../utils";

const tableHead = [
  {
    heading: "Sr No.",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Property Name",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Property Type",
    column: 0,
    isMobile: true,
    isCopy: true,
  },
  {
    heading: "Overview",
    column: 0,
    isMobile: true,
  },
  {
    heading: "No Of Floar",
    column: 0,
    isMobile: true,
  },
  {
    heading: "No Of BedRooms",
    column: 1,
    isMobile: true,
  },
  {
    heading: "Created Date & Time",
    column: 1,
    isMobile: true,
  },
  {
    heading: "Action",
    column: 1,
    isMobile: true,
  },
];



export default function Property() {
  const history = useHistory();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState("");
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const checkEdit = location?.state?.isEdit;
  console.log("checkEdit", checkEdit);

  const [selectFilter, setSelectFilter] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "All",
  });
  const deb = useDebounce(selectFilter?.search, 1000);

  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  let filterData = {
    page: page,
    limit: 10,
    fromDate: selectFilter.fromDate
      ? selectFilter.fromDate.toISOString()
      : undefined,
    toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
    search: selectFilter.search !== "" ? selectFilter.search : undefined,
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
    // userType1: "SUBADMIN",
  };

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listProperties",
        source: source,
        paramsData: filterData,
      });
      if (response.data.responseCode === 200) {
        setTransactionList(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setTransactionList([]);
      }
      setIsClear(false);
      setIsLoading(false);
      // setTransactionList([
      //   {
      //     id: 1,
      //     propertyName: "Sunny Apartments",
      //     propertyType: "Apartment",
      //     overview: "Spacious 2BHK apartment with garden view.",
      //     noOfFloar: 5,
      //     noOfBedRooms: 2,
      //     image: "https://via.placeholder.com/100x100?text=Sunny",
      //     createdAt: "2025-05-01 10:15 AM",
      //   },
      //   {
      //     id: 2,
      //     propertyName: "Oceanview Villa",
      //     propertyType: "Villa",
      //     overview: "Luxury villa with private pool and sea view.",
      //     noOfFloar: 2,
      //     noOfBedRooms: 4,
      //     image: "https://via.placeholder.com/100x100?text=Oceanview",
      //     createdAt: "2025-05-01 10:30 AM",
      //   },
      //   {
      //     id: 3,
      //     propertyName: "Skyline Towers",
      //     propertyType: "Penthouse",
      //     overview: "Top-floor penthouse with skyline view.",
      //     noOfFloar: 15,
      //     noOfBedRooms: 3,
      //     image: "https://via.placeholder.com/100x100?text=Skyline",
      //     createdAt: "2025-05-01 11:00 AM",
      //   },
      //   {
      //     id: 4,
      //     propertyName: "Greenwood Homes",
      //     propertyType: "Independent House",
      //     overview: "3BHK house in a gated community.",
      //     noOfFloar: 2,
      //     noOfBedRooms: 3,
      //     image: "https://via.placeholder.com/100x100?text=Greenwood",
      //     createdAt: "2025-05-01 11:15 AM",
      //   },
      //   {
      //     id: 5,
      //     propertyName: "Metro Residency",
      //     propertyType: "Studio",
      //     overview: "Compact studio apartment near metro station.",
      //     noOfFloar: 10,
      //     noOfBedRooms: 1,
      //     image: "https://via.placeholder.com/100x100?text=Metro",
      //     createdAt: "2025-05-01 12:00 PM",
      //   },
      //   {
      //     id: 6,
      //     propertyName: "Hilltop Mansion",
      //     propertyType: "Bungalow",
      //     overview: "Massive bungalow on hilltop with garden.",
      //     noOfFloar: 3,
      //     noOfBedRooms: 5,
      //     image: "https://via.placeholder.com/100x100?text=Hilltop",
      //     createdAt: "2025-05-01 12:30 PM",
      //   },
      //   {
      //     id: 7,
      //     propertyName: "Budget Flats",
      //     propertyType: "Apartment",
      //     overview: "Affordable housing for small families.",
      //     noOfFloar: 4,
      //     noOfBedRooms: 2,
      //     image: "https://via.placeholder.com/100x100?text=Budget",
      //     createdAt: "2025-05-01 01:00 PM",
      //   },
      //   {
      //     id: 8,
      //     propertyName: "Elite Estate",
      //     propertyType: "Villa",
      //     overview: "Gated community villa with 24x7 security.",
      //     noOfFloar: 2,
      //     noOfBedRooms: 4,
      //     image: "https://via.placeholder.com/100x100?text=Elite",
      //     createdAt: "2025-05-01 01:30 PM",
      //   },
      //   {
      //     id: 9,
      //     propertyName: "Student Suites",
      //     propertyType: "Hostel",
      //     overview: "Furnished shared accommodations for students.",
      //     noOfFloar: 3,
      //     noOfBedRooms: 1,
      //     image: "https://via.placeholder.com/100x100?text=Student",
      //     createdAt: "2025-05-01 02:00 PM",
      //   },
      //   {
      //     id: 10,
      //     propertyName: "Family Residency",
      //     propertyType: "Apartment",
      //     overview: "3BHK flats designed for modern families.",
      //     noOfFloar: 7,
      //     noOfBedRooms: 3,
      //     image: "https://via.placeholder.com/100x100?text=Family",
      //     createdAt: "2025-05-01 02:30 PM",
      //   },
      // ]);

    } catch (err) {
      setTransactionList([]);
      setIsLoading(false);
      console.log(err);
    }
    finally {
      setIsClear(false);
      setIsLoading(false);
    }
  };

  const handleBlockDeleteApi = async (reason) => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: modalOpen === "delete" ? "DELETE" : "PUT",
        endPoint: modalOpen === "delete" ? "deleteProperty" : "toggleBlockProperty",
        bodyData: {
          propertyId: deleteBlockId ? deleteBlockId?._id : undefined,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        modalOpen !== "delete" && handleGetTransaction();
        setModalOpen("");
        modalOpen === "delete" && page > 1
          ? setPage((prePage) => prePage - 1)
          : handleGetTransaction();
      } else {
        toast.error(response.data.responseMessage);
      }

      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
    }
  };

  function tableDataFunction(arrayData, condition) {
    return (
      arrayData &&
      arrayData.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        "Property Name": value?.property_name ? value.property_name.length > 60 ? value.property_name.slice(0, 60) + "..." : value.property_name : "",
        "Property Type": value?.property_type,
        Overview: value?.overview
          ? value.overview.length > 60
            ? value.overview.slice(0, 60) + "..."
            : value.overview
          : "",
        "No Of Floar": value?.no_of_floors,
        "No Of BedRooms": value?.no_of_bedrooms,
        "Created Date & Time": formatDate(value?.createdAt),
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>
              history.push({
                pathname: "/add-property-management",
                state: { ...value, view: true },
              }),
          },
          ...(true
            ? [
              {
                icon: FaEdit,
                onClick: () =>
                  history.push({
                    pathname: "/add-property-management",
                    state: { ...value, edit: true },
                  }),
              },
              {
                icon: BlockIcon,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("block");
                },
                style: { color: value.status === "ACTIVE" ? "green" : "red" }
              },
              {
                icon: DeleteIcon,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("delete");
                },
              },
            ]
            : []),
        ],
      }))
    );
  }




  const handleClearFilter = () => {
    if (!isClear) {
      setSelectFilter({
        fromDate: null,
        toDate: null,
        search: "",
        status: "All",
      });
      setPage(1);
      setIsClear(true);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) {
      handleGetTransaction(source);
    }
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    handleGetTransaction(source);
    return () => {
      source.cancel();
    };
  }, [
    page,
    deb,
    selectFilter.fromDate,
    selectFilter.toDate,
    selectFilter.status,
  ]);

  return (
    <Box>
      <Box className="tophead">
        <Topheading
          heading="Property Management"
          pathname={true ? "/add-property-management" : undefined}
          addButton={"Add Property"}
        />
      </Box>
      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={() => {
            page > 1 && setPage(1);
            page === 1 && handleGetTransaction();
          }}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={transactionList}
          excelTableName="SubAdminManagement"
          apiEndPoint="getUserList"
          placeholder="Search by property name"
          tableDataFunction={tableDataFunction}
          handleClearApi={handleClearFilter}
        />
      </Box>
      <TableComp
        isMobileAdaptive={true}
        tableHead={tableHead}
        scoreListData={tableDataFunction(transactionList)}
        noOfPages={noOfPages}
        page={page}
        setPage={setPage}
        NoDataFoundText="default"
        isLoading={isLoading}
      />
      {modalOpen && (
        <ConfirmationDialogBox
          openModal={["delete", "block"].includes(modalOpen)}
          handleClose={() => setModalOpen("")}
          heading={`${modalOpen === "delete"
            ? "Delete"
            : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
            } Property`}
          description={`Are you sure, you want to ${modalOpen === "delete"
            ? "Delete"
            : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
            } this property?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          blockDescription={"Are you sure, you want to block this property?"}
          showBlock={true}
        />
      )}
    </Box>
  );
}
