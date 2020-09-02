import React from "react";
import "./TableRows.css";
import _ from "lodash";

const TableTitleColumns = props => {
  return (
    <div>
      <tr className={"TitleRow"}>
        {_.map(props.columns, (col, index) => {
          return <th key={`tableTitleColumns_${index}`} className={"Col"}>{col}</th>;
        })}
      </tr>
    </div>
  );
};

export default TableTitleColumns;
