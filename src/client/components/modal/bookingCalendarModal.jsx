import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {
  dateFormat,
  getNextThreeDays,
  generateTimeArray as hours,
} from "../../utils/helpers";
import { useEffect, useState } from "react";
import IndianTime from "../common/indianTime";
import CustomCalendar from "../common/customCalendar";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import PinkPawsbutton from "../common/ui/PinkPawsbutton";
import { object } from "prop-types";
import { getCalender, requestBookingPossibility } from "../../services/api";
// import { getCalender, requestBookingPossibility } from "src/client/services/api";

import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import EastRoundedIcon from '@mui/icons-material/EastRounded';

import CircularProgress from '@mui/material/CircularProgress';

export default function BookingCalendarModal(props) {
  const { starttime, endtime, show, holydays, setTermsAndCondition, branch_id, setWaitBooking, forPos, totalServiceHours } = props;
  console.log(totalServiceHours, "totalServiceHours___")
  const [valueDate, setValue] = useState("");
  const [bgSuccess, setBgSuccess] = useState({});
  const [bgPrimary, setBgPrimary] = useState({});
  const [hoursArray, setHoursArray] = useState([]);
  const [todayButton, setTodayButton] = useState(false);
  const [selectedTimeLabel, setSelectedTimeLabel] = useState("");
  const [selectSlotDateTime, setSelectSlotDateTime] = useState("");
  const [metaData, setMetaData] = useState({
    _meta: {},
  });
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [day, setDay] = useState(new Date());
  const [timeSectionOn, setTimeSectionOn] = useState(false);
  const [dateSectionOn, setDateSectionOn] = useState(true);
  const [showDays, setShowDays] = useState([]);
  const [checkBoxTandC, setcheckBoxTandC] = useState(false)
  const [alert_warning, setAlert_warning] = useState("")
  const [alerttype_warning, setType_warning] = useState(false)
  console.log(alert_warning, "alert_warning")
  console.log(valueDate, "bgPrimary")
  console.log(bgSuccess, selectedTimeLabel, selectSlotDateTime, metaData, "selectSlotDateTime")
  console.log(showDays, "showDays")
  useEffect(() => {
    console.log("endtime>>>>>>>>>", endtime, "valueDate", valueDate);
    setHoursArray(
      hours(starttime, endtime, valueDate || new Date(), currentDateTime)
    );
    calendarOffTimeOn(true);
  }, [starttime, endtime, valueDate, currentDateTime, show]);


  const [calendarBook, setCalendarBook] = useState(4);

  const getCalenderBook = () => {
    getCalender()
      .then((res) => {
        console.log("calender res", res?.success);
        if (res && res?.success) {
          setCalendarBook(res?.data[0]?.calender_date_show)
        }
      })

  }

  let days = [
    { id: 0, day: 'Sun' },
    { id: 1, day: 'Mon' },
    { id: 2, day: 'Tue' },
    { id: 3, day: 'Wed' },
    { id: 4, day: 'Thu' },
    { id: 5, day: 'Fri' },
    { id: 6, day: 'Sat' }
  ];

  const weekHolyday = () => {
    if (holydays?.length) {
      let datew = days.map((d) => holydays.filter((v) => v?.week == d?.id).map((val) => val)).filter((item) => item.length > 0);
      console.log(datew[0][0], "datew")
      if (datew[0]?.length) {
        return days[datew[0][0]?.week]?.id
      }
    }
  }
  console.log(weekHolyday(), showDays, "weekHolyday")

  useEffect(() => {
    const todaySelect = new Date(new Date().setHours(0, 0, 0, 0));
    const filter = holydays.filter((item) => {
      if (item?.date == todaySelect.getTime()) {
        return item;
      }
    });
    if (!filter.length) {
      handelDateOnClick(todaySelect, 0);
    } else {
      setHoursArray(
        hours(
          starttime,
          endtime,
          valueDate || new Date(),
          currentDateTime,
          true,
          filter[0]["remarks"]
        )
      );
    }
    if (calendarBook) {
      console.log(calendarBook, "calendarBook1")
      setShowDays(getNextThreeDays(holydays, 30));
      // setShowDays(getNextThreeDays(holydays, calendarBook));
    }
  }, [calendarBook]);


  useEffect(() => {
    getCalenderBook()
  }, [])

  useEffect(() => {
    tooltipSetup();
  }, [showDays.length, hoursArray.length]);

  const tooltipSetup = () => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    // const tooltipList = [...tooltipTriggerList].map(
    //   (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    // );
  };

  function clearAllTooltips() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    // tooltipTriggerList.forEach((tooltipTriggerEl) => {
    //   const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
    //   if (tooltip) {
    //     tooltip.dispose();
    //   }
    // });
  }

  // Custom methods

  const [isClickedOnDate, setIsClickedOnDate] = useState(false);
  function handelDateOnClick(value, index) {
    // console.log(typeof value, "date convert", typeof new Date(`${value}`));
    setIsClickedOnDate(true);
    console.log(value);
    setValue(value);
    setBgPrimary({
      [index]: "timeSelect_badge_primary",
    });
    clearAllTooltips();
    setAlert_warning("")
    // setTodayButton(true);
    // calendarOffTimeOn();
  }

  function calendarOffTimeOn(dateForeceOn = false) {
    setTimeSectionOn(true);
    setDateSectionOn(dateForeceOn);
  }

  function calendarOnTimeOff() {
    setTimeSectionOn(false);
    setDateSectionOn(true);
  }

  function handelTimeOnClick(value, index) {
    console.log(value);
    setBgSuccess({
      [index]: "timeSelect_badge_success",
    });
    setSelectedTimeLabel({ label: value.label, value: value.value });
    let matchString = /(\d+):(\d+) (\w+)/;
    if (!value.label.includes(" AM") || !value.label.includes(" PM")) {
      matchString = /(\d+):(\d+)/;
    }
    const [hours, minutes] = value.label.match(matchString).slice(1);
    console.log(hours, minutes, "hoursminutes")
    const targetTime = valueDate;
    setSelectSlotDateTime(targetTime);
    // console.log({
    //   _meta: value,
    //   selected: targetTime.setHours(hours, minutes, 0, 0),
    // })
    setMetaData({
      _meta: value,
      selected: targetTime.setHours(hours, minutes, 0, 0),
    });
  }

  useEffect(() => {
    if (metaData?.selected && branch_id) {
      requestBookingPossibility({ branch_id: branch_id, time: metaData?.selected, total_minutes: totalServiceHours })
        .then((data) => {
          if (data?.data === false) {
            setAlert_warning(data?.massage)
            setWaitBooking(true)
            setType_warning(true)
          } else {
            setAlert_warning("")
            setWaitBooking(false)
            setType_warning(false)
          }
        })
        .catch((error) => console.log(error, "__error"))
    }
  }, [metaData?.selected, branch_id, totalServiceHours])

  console.log(metaData, "MetaData_");

  function clearState(date = null) {
    setValue("");
    setBgSuccess({});
    setBgPrimary({});
    setSelectedTimeLabel("");
    setSelectSlotDateTime("");
    setTodayButton(false);
    calendarOnTimeOff();
  }

  function todayButtonHandel(e) {
    e.preventDefault();
    setValue(new Date());
    setTodayButton(false);
    clearState();
  }

  function todaySelection() {
    return (
      <>
        or&nbsp;
        <a
          href="#"
          onClick={todayButtonHandel}
          className="text-decoration-none"
        >
          select today
        </a>
      </>
    );
  }

  function requestConfirm() {
    if (selectedTimeLabel && selectSlotDateTime) {
      // props.onHide();
      props.callback(true, metaData);
      clearState();
    }
  }
  function ShowTermsAndcondition() {
    if (selectedTimeLabel && selectSlotDateTime) {
      // props.onHide();
      setTermsAndCondition(true)
      requestConfirm()
    }
  }

  function getTodayTime(event) {
    setCurrentDateTime(event);
  }

  // useEffect(() => {
  //   setSelectedTimeLabel("");
  //   setMetaData({
  //     _meta: {}
  //   });

  // }, [Object.keys(bgPrimary)[0]])
  useEffect(() => {
    setBgSuccess({})
    setSelectedTimeLabel('')
    setSelectSlotDateTime('')
    setMetaData({
      _meta: {},
    });
  }, [valueDate])


  const [isHoliday, setIsHoliday] = useState(false);

  const getHolidayStatus = (val) => {
    setIsHoliday(val);
  }

  console.log(hoursArray)


  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function convertToAMPM(time) {
    const [hour, minute] = time.split(':').map(Number);
    const isPM = hour >= 12;
    const newHour = hour % 12 || 12; // Convert 0 hour to 12 (for midnight)
    const period = isPM ? 'PM' : 'AM';
    return `${newHour}:${minute < 10 ? '0' + minute : minute} ${period}`;
  }

  const updatedTimeData = hoursArray.map(item => {
    const labelInAMPM = convertToAMPM(item.label.trim());
    const valueInAMPM = item.label.trim();
    setTimeout(() => {
      setIsClickedOnDate(false)
    }, 1000)
    return {
      ...item,
      label2: labelInAMPM,
    };
  });
  console.log(hoursArray)
  console.log(updatedTimeData)






  return (
    <>
      {/* <Modal
        show={props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          props.onHide();
          clearState();
          setTodayButton(false);
        }}
      > */}
      {/* <Row>
        <Col xs={18} md={12}>
          <h4>Select date for your service</h4>
        </Col>
      </Row> */}

      <div className="w-full">
        {!checkBoxTandC && <Container>
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <Badge pill className="timeSelect_badge_primary">
              {/* <Badge pill bg="primary"> */}
              Date Selected
            </Badge>
            {/* <Badge pill className="timeSelect_badge_success"> */}
            <Badge pill bg="success">
              Time Selected
            </Badge>
            {/* <Badge pill bg="secondary">
              Time Off
            </Badge> */}
            {/* <Badge pill className="timeSelect_badge_danger"> */}
            <Badge pill bg="danger">
              Holiday
            </Badge>
          </Stack>

          <hr className="mb-3 mt-2" />
          {dateSectionOn && (


            <DateSlider
              dateSectionOn={true}
              showDays={showDays} // Array of dates
              weekHolyday={weekHolyday} // Function to check if a date is a holiday
              bgPrimary={bgPrimary} // Array of background colors for dates
              handelDateOnClick={handelDateOnClick} // Function to handle date selection
              getHolidayStatus={getHolidayStatus}
              holiday={holydays && holydays.length && holydays}
            />
          )}
          <hr className="mt-0 mb-3" />

          {timeSectionOn && isHoliday === false ? (
            isClickedOnDate ?
              <div className="w-100 d-flex justify-content-center align-items-center">
                <div class="custom_loader"></div>
              </div>
              :
              <Row>
                {/* <Col xs={18} md={12}>
              <h4>
                {hoursArray.length ? "Please select time for your slots" : ""}
              </h4>
            </Col> */}
                <Col xs={18} md={12}>
                  {alert_warning !== "" ?
                    <div className="alert_warning">
                      <div>
                        <strong>Warning:</strong> <span style={{ textTransform: "capitalize" }}>{"Time Slot In Use"}</span>
                      </div>
                      <div style={{ cursor: "pointer" }} onClick={() => setAlert_warning("")}>
                        <i class="fa fa-times" aria-hidden="true"></i>
                      </div>
                    </div> : null}
                  <Row>
                    {valueDate !== "" ?
                      hoursArray.length ? (
                        updatedTimeData.map((v, i) => {
                          return (
                            <>
                              {!v.disabled ? (
                                <Col
                                  xs={6}
                                  md={4}
                                  className="text-center mb-2"
                                  key={i}
                                >
                                  <div
                                    className={`${bgSuccess[i]
                                      ? bgSuccess[i]
                                      : metaData._meta.label == v.label
                                        ? "timeSelect_badge_success text-white"
                                        : ""
                                      } border rounded p-1 customCalendarTime`}
                                    onClick={() =>
                                      !v.disabled ? handelTimeOnClick(v, i) : ""
                                    }
                                  >
                                    {v.label2}
                                  </div>
                                </Col>
                              ) : (
                                <Col
                                  xs={6}
                                  md={4}
                                  className="text-center mb-2"
                                  key={i}
                                >
                                  <div
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    data-bs-custom-class="custom-tooltip"
                                    data-bs-title={
                                      v.remarks
                                        ? v.remarks
                                        : "Can't access past time"
                                    }
                                    className={`bg-secondary disabled-cursor border rounded p-1 customCalendarTime`}
                                  >
                                    {v.label}
                                  </div>
                                </Col>
                              )}
                            </>
                            // <Col xs={6} md={4} className='text-center mb-2' key={i}>
                            //     <div className={`${bgSuccess[i] ? bgSuccess[i] : ''} ${v.disabled ? 'bg-secondary disabled-cursor' : ''} border rounded p-1 customCalendarTime`} onClick={() => !v.disabled ? handelTimeOnClick(v, i) : ''}>{v.label}</div>
                            // </Col>
                          );
                        })
                      ) : (
                        <div className="text-center">
                          <i class="fa fa-ban" aria-hidden="true"></i>&nbsp;Center
                          is closed now .
                        </div>
                      ) : <div className="text-center">
                        <i class="fa fa-ban" aria-hidden="true"></i>&nbsp;Please select date first
                      </div>}
                  </Row>
                </Col>
              </Row>

          ) :
            <Row>
              <p>Bookings unavailable for this holiday, explore alternative dates or options.</p>
            </Row>
          }

          <hr />
          {forPos ?
            <PinkPawsbutton
              icon={<i className="fa fa-clock-o"></i>}
              name={"BOOK NOW"}
              disabled={alerttype_warning ? true : !selectSlotDateTime ? true : false}
              handleClick={() => {
                selectSlotDateTime ? ShowTermsAndcondition() : null;
              }}
            />
            :
            <PinkPawsbutton
              icon={<i className="fa fa-clock-o"></i>}
              name={alerttype_warning ? "WAITING NOW" : "BOOK NOW"}
              disabled={!selectSlotDateTime}
              handleClick={() => {
                selectSlotDateTime ? ShowTermsAndcondition() : null;
              }}
            />}
          {/* <PinkPawsbutton
            icon={<i className="fa fa-clock-o"></i>}
            name={"Apply"}
            disabled={!selectSlotDateTime}
            handleClick={() => {
              selectSlotDateTime ? requestConfirm() : null;
            }}
          /> */}
        </Container>}
      </div>


      {/* <Button
            className="custom-book-button"
            variant="primary"
            disabled={!selectSlotDateTime}
            onClick={() => {
              selectSlotDateTime ? requestConfirm() : null;
            }}
          >
            <i className="fa fa-clock-o"></i>&nbsp;Next
          </Button> */}
      {/* </Modal> */}
      {/* <IndianTime getCurrentDate={getTodayTime} /> */}
    </>
  );
}

export const Backup = () => {
  return (
    <>
      <Modal
        show={props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          props.onHide();
          clearState();
          setTodayButton(false);
        }}
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
                        Request booking on {dateFormat(valueDate)} {selectedTimeLabel ? selectedTimeLabel?.label ? selectedTimeLabel.label : '' : ''}
                    </Modal.Title> */}
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Container>
            {dateSectionOn && (
              <Row className="mb-4">
                <Col xs={18} md={12}>
                  <h4>Select date for your service</h4>
                </Col>
                {showDays.length
                  ? showDays.map((v, i) => {
                    return (
                      <>
                        {weekHolyday() === v?.weekId ? (
                          <Col
                            xs={6}
                            md={3}
                            className="text-center mb-2"
                            key={i}
                          >
                            <div
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title={v?.remarks}
                              className={`bg-danger disabled-cursor text-white border rounded p-1 customCalendarDate`}
                              style={{ fontSize: "12px" }}
                              onClick={() => {
                                if (!v.disabled) {
                                  handelDateOnClick(v.value, i)
                                }
                                // !v.disabled ? handelDateOnClick(v.value, i) : ""
                              }}
                            >
                              {v.label}
                            </div>
                          </Col>
                        ) : !v.disabled ? (
                          <Col
                            xs={6}
                            md={3}
                            className="text-center mb-2"
                            key={i}
                          >
                            <div
                              className={`${bgPrimary[i]
                                ? bgPrimary[i] + " text-white"
                                : ""
                                } border rounded p-1 customCalendarDate`}
                              onClick={() =>
                                !v.disabled
                                  ? handelDateOnClick(v.value, i)
                                  : ""
                              }
                            >
                              {v.label}
                            </div>
                          </Col>
                        ) : (
                          <Col
                            xs={6}
                            md={3}
                            className="text-center mb-2"
                            key={i}
                          >
                            <div
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title={v?.remarks}
                              className={`bg-danger disabled-cursor text-white border rounded p-1 customCalendarDate`}
                              onClick={() =>
                                !v.disabled
                                  ? handelDateOnClick(v.value, i)
                                  : ""
                              }
                            >
                              {v.label}
                            </div>
                          </Col>
                        )}
                      </>

                      // <Col xs={6} md={3} className='text-center mb-2' key={i}>
                      //     <div className={`${bgPrimary[i] ? bgPrimary[i] + ' text-white' : ''} ${v.disabled ? 'bg-danger disabled-cursor text-white' : ''} border rounded p-1 customCalendarDate`} onClick={() => !v.disabled ? handelDateOnClick(v.value, i) : ''}>{v.label}</div>
                      // </Col>
                    );
                  })
                  : null}
                {/* <CustomCalendar holidays={props?.holydays} onChangeCallback={(value) => handelDateOnClick(value, "na")} selectedDate={valueDate}/> */}
              </Row>
            )}

            {timeSectionOn && (
              <Row>
                <Col xs={18} md={12}>
                  <h4>
                    {hoursArray.length
                      ? "Please select time for your slots"
                      : ""}
                  </h4>
                </Col>
                <Col xs={18} md={12}>
                  <Row>
                    {hoursArray.length ? (
                      updatedTimeData.map((v, i) => {
                        return (
                          <>
                            {!v.disabled ? (
                              <Col
                                xs={6}
                                md={4}
                                className="text-center mb-2"
                                key={i}
                              >
                                <div
                                  className={`${bgSuccess[i] ? bgSuccess[i] : ""
                                    } border rounded p-1 customCalendarTime`}
                                  onClick={() =>
                                    !v.disabled ? handelTimeOnClick(v, i) : ""
                                  }
                                >
                                  {v.label}
                                </div>
                              </Col>
                            ) : (
                              <Col
                                xs={6}
                                md={4}
                                className="text-center mb-2"
                                key={i}
                              >
                                <div
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  data-bs-custom-class="custom-tooltip"
                                  data-bs-title={
                                    v.remarks
                                      ? v.remarks
                                      : "Can't access past time"
                                  }
                                  className={`bg-secondary disabled-cursor border rounded p-1 customCalendarTime`}
                                >
                                  {v.label}
                                </div>
                              </Col>
                            )}
                          </>
                          // <Col xs={6} md={4} className='text-center mb-2' key={i}>
                          //     <div className={`${bgSuccess[i] ? bgSuccess[i] : ''} ${v.disabled ? 'bg-secondary disabled-cursor' : ''} border rounded p-1 customCalendarTime`} onClick={() => !v.disabled ? handelTimeOnClick(v, i) : ''}>{v.label}</div>
                          // </Col>
                        );
                      })
                    ) : (
                      <div className="text-center">
                        <i class="fa fa-ban" aria-hidden="true"></i>&nbsp;Center
                        is closed now .
                      </div>
                    )}
                  </Row>
                </Col>
              </Row>
            )}
          </Container>
        </Modal.Body>

        <Modal.Footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="horizontal" gap={2} className="float-start">
            <Badge pill bg="primary">
              Date Selected
            </Badge>
            <Badge pill bg="success">
              Time Selected
            </Badge>
            <Badge pill bg="secondary">
              Time Off
            </Badge>
            <Badge pill bg="danger">
              Holiday
            </Badge>
          </Stack>

          <Button
            className="custom-book-button"
            variant="primary"
            disabled={!selectSlotDateTime}
            onClick={() => {
              selectSlotDateTime ? requestConfirm() : null;
            }}
          >
            <i className="fa fa-clock-o"></i>&nbsp;Next
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <IndianTime getCurrentDate={getTodayTime} /> */}
    </>
  );
};



const DateSlider = ({ dateSectionOn, showDays, weekHolyday, bgPrimary, handelDateOnClick, getHolidayStatus, holiday }) => {
  console.log({ dateSectionOn, showDays, weekHolyday, bgPrimary, handelDateOnClick })
  const [currentIndex, setCurrentIndex] = useState(0); // Track the starting index of visible dates
  const [selectedIndex, setSelectedIndex] = useState(0); // Track the selected index
  // const itemsPerPage =  window.screen.width < 480 ? 3 : window.screen.width < 576 ? 4 : window.screen.width < 1400 ? 5; // Number of dates to show at a time
  let itemsPerPage;
  if (window.screen.width <= 480) {
    itemsPerPage = 3;
  } else if (window.screen.width <= 1400) {
    itemsPerPage = 4;
  } else {
    itemsPerPage = 5;
  }

  console.log(currentIndex)
  // Function to handle "Next" button click
  const handleNext = () => {
    if (currentIndex + itemsPerPage < showDays.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  // Function to handle "Previous" button click
  const handlePrevious = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  // Get the visible dates based on the currentIndex
  const visibleDates = showDays.slice(currentIndex, currentIndex + itemsPerPage);
  // console.log(visibleDates)
  // console.log(showDays)

  // Function to handle date selection
  const handleDateSelect = (index) => {
    setSelectedIndex(currentIndex + index); // Select from showDays array
  };


  const getHoliDayTime = (val) => {
    return new Date(val).setHours(0, 0, 0, 0)
  }

  let filterHolidates = [];
  filterHolidates = holiday && holiday.length > 0 && holiday.filter((date) => date.date !== null);
  useEffect(() => {
    // const holidayDates = visibleDates.filter((vDate) => filterHolidates && filterHolidates.length > 0 && filterHolidates.map((d) => console.log(getHoliDayTime(vDate.value) == d.date)))

    const holidayDates = visibleDates.filter((vDate) =>
      filterHolidates && filterHolidates.length > 0 && filterHolidates.some((d) => getHoliDayTime(vDate.value) == d.date)
    );


    console.log(filterHolidates);
  }, [holiday])

  return (
    <>
      {dateSectionOn && (
        <div>
          {/* Display Visible Dates */}
          <div className="d-flex gap-1 justify-content-between align-items-center my-2">
            <KeyboardBackspaceRoundedIcon
              onClick={handlePrevious}
              disabled={currentIndex === 0} // Disable if at the start
              style={{
                cursor: "pointer",
                color: "#e4509e"
              }}
            />
            {visibleDates.map((v, i) => (
              <div xs={6} md={3} className="text-center" key={i}>
                {weekHolyday() === v?.weekId ? (
                  <div
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title={v?.remarks}
                    className={`bg-danger disabled-cursor text-white border rounded px-2 py-1 customCalendarDate`}
                    style={{ fontSize: "12px", padding: "5px 15px", width: "100%", maxWidth: "60px", minWidth: "60px", backgroundColor: "red" }}
                    onClick={() => {
                      if (!v.disabled) {
                        handelDateOnClick(v.value, i);
                        getHolidayStatus(true);
                      }
                    }}
                  >
                    <div style={{ fontSize: "11px", }}>{v.label && v.label.split(" ")[0]}</div>
                    <div style={{ fontSize: "12px", fontWeight: "700", }}>{v.label && v.label.split(" ")[1]}</div>
                    <div className="month" style={{ fontSize: "11px", color: "#b9b8b8", fontWeight: "500" }}>{v.label && v.label.split(" ")[2]}</div>
                  </div>
                ) :
                  holiday && holiday.length > 0 && filterHolidates && filterHolidates.length > 0 && filterHolidates.some((d) => getHoliDayTime(v.value) == d.date) ?
                    <>

                      <div
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={v?.remarks}
                        className={`bg-danger disabled-cursor text-white border rounded px-2 py-1 customCalendarDate`}
                        style={{ fontSize: "12px", padding: "5px 15px", width: "100%", maxWidth: "60px", minWidth: "60px", backgroundColor: "red" }}
                        onClick={() => {
                          if (!v.disabled) {
                            handelDateOnClick(v.value, i);
                            getHolidayStatus(true);
                          }
                        }}
                      >
                        <div style={{ fontSize: "11px", }}>{v.label && v.label.split(" ")[0]}</div>
                        <div style={{ fontSize: "12px", fontWeight: "700", }}>{v.label && v.label.split(" ")[1]}</div>
                        <div className="month" style={{ fontSize: "11px", color: "#b9b8b8", fontWeight: "500" }}>{v.label && v.label.split(" ")[2]}</div>
                        {/* {v.label} */}
                      </div>

                    </> :

                    !v.disabled ? (
                      <div
                        className={`${selectedIndex === currentIndex + i
                          ? "timeSelect_badge_primary text-white"
                          : "black"
                          } border rounded customCalendarDate`}
                        // className={`${bgPrimary[i] ? bgPrimary[i] + " text-white" : ""
                        //   } border rounded p-1 customCalendarDate`}
                        style={{ fontSize: "12px", padding: "5px 15px", width: "100%", maxWidth: "60px", minWidth: "60px", }}
                        onClick={() => {
                          !v.disabled && handelDateOnClick(v.value, i); handleDateSelect(i); getHolidayStatus(false);
                        }}
                      >
                        <div style={{ fontSize: "11px", }}>{v.label && v.label.split(" ")[0]}</div>
                        <div style={{ fontSize: "12px", fontWeight: "700", }}>{v.label && v.label.split(" ")[1]}</div>
                        <div className="month" style={{ fontSize: "11px", color: "#b9b8b8", fontWeight: "500" }}>{v.label && v.label.split(" ")[2]}</div>
                      </div>
                    ) : (
                      <div
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={v?.remarks}
                        className={`bg-danger disabled-cursor text-white border rounded px-2 py-1 customCalendarDate`}
                        style={{ fontSize: "12px" }}
                        onClick={() => {
                          if (!v.disabled) {
                            handelDateOnClick(v.value, i);
                          }
                        }}
                      >
                        {v.label}
                      </div>
                    )}
              </div>
            ))}

            {/* <div>
              <div>
                {visibleDates.map((date, index) => (
                  <button
                    key={date.value}
                    onClick={() => handleDateSelect(index)} // Set selected date when clicked
                    style={{
                      backgroundColor: selectedIndex === currentIndex + index ? "blue" : "transparent", // Highlight selected date from showDays
                      color: selectedIndex === currentIndex + index ? "white" : "black", // Text color for selected date
                      padding: "10px",
                      margin: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc"
                    }}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
              <div>
                <button onClick={handlePrevious} disabled={currentIndex === 0}>
                  Previous
                </button>
                <button onClick={handleNext} disabled={currentIndex + itemsPerPage >= showDays.length}>
                  Next
                </button>
              </div>
            </div> */}

            <EastRoundedIcon
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= showDays.length} // Disable if no more dates
              style={{
                cursor: "pointer",
                color: "#e4509e"
              }}
            />
          </div>

          {/* Navigation Buttons */}
          {/* <div className="d-flex justify-content-between mb-3">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0} // Disable if at the start
            >
              
            </Button>





            <Button
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= showDays.length} // Disable if no more dates
            >
            </Button>
          </div> */}
        </div>
      )}
    </>
  );
};