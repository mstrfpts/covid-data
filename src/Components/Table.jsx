import React from "react";

import TableRows from "./TableRows";
import TableTitleColumns from "./TableTitleColumns";
import "./TableRows.css";

const Table = props => {
  return (
    <table id="Header" className={"Table"}>
      <TableTitleColumns columns={props.columns} />
      <div
        style={{
          height: props.heightSetter()
        }}
        className={"Scroll"}
      >
        {props.filteredData.map((el, index) => (
          <TableRows
            key={index}
            row={el}
            index={index}
            updateGraph={props.updateGraph}
          />
        ))}
      </div>
    </table>
  );
};

export default Table;
