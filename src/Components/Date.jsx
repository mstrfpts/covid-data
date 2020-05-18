function formattedDate(offset = 0) {
  let date = new Date();
  let calculatedDay = new Date(date);
  calculatedDay.setDate(calculatedDay.getDate() + offset);
  let dateString = new Intl.DateTimeFormat("en-US").format(calculatedDay) + "";

  let dateArray = dateString.split("/");
  dateArray[2] = dateArray[2].slice(0, 2);
  dateString = dateArray.join("/");
  return dateString;
}

export default formattedDate;
