import { CCard, CCardBody, CCardHeader, CFormCheck } from "@coreui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const MenueDragDrop = () => {
  const [menueListArr, setMenueListArr] = useState([]);
  const checkListArr = [
    { value: "Dashboard" },
    { value: "Pet category" },
    { value: "Service" },
    { value: "Branch" },
    { value: "Booking orders" },
    { value: "Holiday" },
    { value: "Settings" },
    { value: "Store" },
    { value: "Operator" },
    { value: "Dog Training" },
  ];

  const checked = (value) => {
    const itemChecked = menueListArr.filter((item) => item.value == value);
    console.log(itemChecked, "itemChecked");
    if (itemChecked.length) {
      return true;
    } else {
      return false;
    }
  };

  const enterVal = (e) => {
    if (e.target.checked) {
      setMenueListArr([...menueListArr, { value: e.target.value }]);
    } else {
      const itemChecked = menueListArr.filter(
        (item) => item.value != e.target.value
      );
      setMenueListArr(itemChecked);
    }
  };

  console.log(menueListArr, "menueListArr");

  // drag and drop functions
  const dragStart = (e) => {
    e.dataTransfer.setData("widgetType", item.value);
  };
  const dropArea = (e) => {
    const findData = e.dataTransfer.getData("widgetType");
    setMenueListArr([...menueListArr, { value: findData }]);
  };

  return (
    <>
      <section className="container ">
        <div
          // className="mt-5"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* <CCard style={{ height: "fit-content" }} className="mb-4"> */}
          {/* <CCardHeader>
              <strong>check list</strong>
            </CCardHeader> */}
          <CCardBody className="tableCardbody">
            {checkListArr.map((item, idx) => (
              <CFormCheck
                key={idx}
                inline
                type="checkbox"
                name="inlineRadioOptions"
                checked={checked(item.value)}
                value={item.value}
                onChange={(e) => {
                  console.log(item.value, "navLinks_root");
                  enterVal(e);
                }}
                label={item.value}
              />
            ))}
          </CCardBody>
          {/* </CCard> */}
          {menueListArr.length ? (
            <CCard className="mb-4">
              <CCardHeader>
                <strong>check list</strong>
              </CCardHeader>
              <CCardBody>
                {menueListArr.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ marginBottom: '0' }}
                    className="linksTab_root"
                  // draggable
                  // onDragStart={(e) => dragStart(e)}
                  // onDrop={(e) => dropArea(e)}
                  // onDragOver={(e) => e.preventDefault()}
                  >
                    {item.value}
                  </div>
                ))}
              </CCardBody>
            </CCard>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default MenueDragDrop;
