import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs"; 

const FilterbyDate = ({ isDatepickerOpen, setIsDatepickerOpen, startDate, setStartDate, endDate, setEndDate,GetMfgMappingListData }) => {
  const [isDateRangeChecked, setIsDateRangeChecked] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);  
  const [selecting, setSelecting] = useState("from"); 

  const handleDateChange = (date) => {
    if (selecting === "from") {
      setStartDate(date);
      setSelecting("to"); 
    } else {
      setEndDate(date);
      setSelecting("from"); 
    }
  };

  const handlePredefinedRange = (range) => {
    let start, end;
    const today = dayjs();

    switch (range) {
      case "This Week":
        start = today.startOf("week");
        end = today.endOf("week");
        break;
      case "Last Week":
        start = today.subtract(1, "week").startOf("week");
        end = today.subtract(1, "week").endOf("week");
        break;
      case "This Month":
        start = today.startOf("month");
        end = today.endOf("month");
        break;
      case "Last Month":
        start = today.subtract(1, "month").startOf("month");
        end = today.subtract(1, "month").endOf("month");
        break;
      case "This Year":
        start = today.startOf("year");
        end = today.endOf("year");
        break;
      case "Last Year":
        start = today.subtract(1, "year").startOf("year");
        end = today.subtract(1, "year").endOf("year");
        break;
      default:
        return;
    }

    setStartDate(start.toDate());
    setEndDate(end.toDate());
    setSelectedRange(range);
    setIsDateRangeChecked(false);
  };

  return (
    <Box position="relative">
      {isDatepickerOpen && (
        <Box
          position="absolute"
          top="127px"
          mt={2}
          p={4}
          bg="white"
          boxShadow="0px 1px 3px #b8b5b5"
          borderRadius="md"
          zIndex={10}
          width="330px"
          right="7px"
          
          
        >
          <Text color="#1C1D22" fontSize="16px" fontWeight="600" mb={4}>
            By Date
          </Text>

          <Flex flexWrap="wrap" gap="13px" justifyContent="space-between">
            {["This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year"].map((label) => (
              <Checkbox key={label} w="46%" alignItems="center" color="#83898C" fontSize="14px"
              isChecked={selectedRange === label}
              onChange={() => handlePredefinedRange(label)}
              >
                {label}
              </Checkbox>
            ))}
          </Flex>
          <Divider my={4} />

          <Checkbox
            isChecked={isDateRangeChecked}
            onChange={(e) => setIsDateRangeChecked(e.target.checked)}
            w="full"
            alignItems="center"
            color="#83898C"
            fontSize="14px"
          >
            Date Range
          </Checkbox>

          {isDateRangeChecked && (
            <Box mt={4}>
              <HStack gap="0">
                <Button
                  onClick={() => setSelecting("from")}
                  height="inherit"
                  padding="9px 58px"
                  bg={selecting === "from" ? "#5570F1" : "#E4E8EE"}
                  color={selecting === "from" ? "white" : "#5570F1"}
                  borderRadius={selecting === "from" ? "8px" : "8px 0px 0px 8px"}
                  fontWeight="500"
                  fontSize="14px"
                >
                  From
                </Button>

                <Button
                  onClick={() => setSelecting("to")}
                  height="inherit"
                  padding="9px 58px"
                  bg={selecting === "to" ? "#5570F1" : "#E4E8EE"}
                  color={selecting === "to" ? "white" : "#5570F1"}
                  borderRadius={selecting === "to" ? "8px" : "0px 8px 8px 0px"}
                  fontWeight="500"
                  fontSize="14px"
                  isDisabled={!startDate} // Disable until "From" is selected
                >
                  To
                </Button>
              </HStack>

              {/* Date Picker */}
              <Box mt={4} className="datepicker-container">
                <DatePicker
                  selected={selecting === "from" ? startDate : endDate}
                  onChange={handleDateChange}
                  selectsStart={selecting === "from"}
                  selectsEnd={selecting === "to"}
                  startDate={startDate}
                  endDate={endDate}
                  minDate={selecting === "to" ? startDate : null}
                  inline
                />
              </Box>
            </Box>
          )}

          <Button
            mt={4}
            bg="#3E60AA"
            color="white"
            _hover={{ bg: "#5f83b4" }}
            width="full"
            borderRadius="12px"
            onClick={() => {
                GetMfgMappingListData(); 
              setIsDatepickerOpen(false); 
            }}
            isDisabled={!startDate || !endDate}
          >
            Filter
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FilterbyDate;
