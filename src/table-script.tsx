import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";

/**
 * Example of how a TableDataType object should be structured.
 *
 * Each `TableDataType` object has the following properties:
 * @prop {string} ticketId - The unique identifier for the ticket.
 * @prop {string} userId - The unique identifier for the user associated with the booking.
 * @prop {string} timeBooked - The time duration booked by the user, typically in hours or minutes.
 * @prop {string} bookingDate - The date when the booking was made, formatted as a string.
 */

const getUserId = (usrId:any) => {
  return usrId.split("/")[1].toString();
};

function getDescription(descval:any) {
  console.log("getDescription : ", descval);
  if (descval) {
    const regex = /\[(SOL-\d+)\]/;
    const value = descval?.match(regex);
    return value ? value[1] : "--";
  }
}

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).map((dataRow, index) => {
  const descriptionValue = dataRow?.timelog?.description;
  if (
    Object.keys(dataRow)[0] === "timelog" &&
    dataRow?.timelog.hasOwnProperty("description")
  ) {
    const userId = getUserId(dataRow?.timelog?.person);
    const row: TableDataType = {
      ticketId: getDescription(dataRow?.timelog?.description),
      userId,
      bookingDate: `${dataRow?.timelog?.date}`,
      timeBooked: `${dataRow?.timelog?.duration}`,
    };
    return row;
  } 
});

// Function to extract numeric part from ID
const extractNumber = (id:any) => {
  const match = id.match(/SOL-(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// tableData.sort((a, b) => extractNumber(a.ticketId) - extractNumber(b.ticketId));

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "ticketId",
        header: "Ticket Id",
      },
      {
        accessorKey: "userId",
        header: "User Id",
      },
      {
        accessorKey: "bookingDate",
        header: "Booking Date",
      },
      {
        accessorKey: "timeBooked",
        header: "Time Booked",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
