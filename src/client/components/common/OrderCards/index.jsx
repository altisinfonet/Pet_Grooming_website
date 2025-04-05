import React from 'react'
import { Card } from 'react-bootstrap';

const OrderCards = (data = null, index = null) => {
  if (data) {
    const {
      status,
      booking_metadata,
      booking_date_in_number,
      serviceend_date_in_number,
      map_details,
      block_slot,
      _id,
    } = data;
    const { branch, totalPrice } = booking_metadata;
    const { status_code } = status;
    console.log(map_details, "booking_metadata")
    console.log(block_slot, "block_slot")
    console.log(data?.order_id, `c`, moment().tz('Asia/Kolkata').format("LT"), `r`, moment(block_slot?.retry_time).tz('Asia/Kolkata').format("LT"), `b`, moment(block_slot?.block_time).tz('Asia/Kolkata').format("LT"), "skiyrgfsoufh")

    return (
      <Card style={{ width: "19rem" }} className="mb-2 responsiveViewCard petdetails_card" data-aos="zoom-in">
        <Card.Header className="order-header-root">
          <h5 className="p-0 m-0 ordertext">ORDER {index + 1}</h5>
          <div className="d-flex align-items-center gap-3">
            {badgeStatus(status)}
            <i
              className="fa fa-eye curser-pointer"
              aria-hidden="true"
              onClick={() =>
                handelView(objectFieldConvertToArray(booking_metadata))
              }
            ></i>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <div className="d-flex"><span>Order Id:</span>{data?.order_id}</div>
            <div className="d-flex"><span>Branch:</span>  {branch}</div>
            <div className="d-flex"><span>Total Price:</span> ₹{totalPrice}</div>
            <div className="d-flex"><span>Date:</span> {moment(booking_date_in_number).format('LL')}</div>
            <div className="d-flex"><span>Start Time:</span>{moment(booking_date_in_number).format('LT')}</div>
            <div className="d-flex"><span>End Time:</span>{moment(serviceend_date_in_number).format('LT')}</div>
            {map_details?.length ? map_details.map((v, i) => <div key={i} style={{ borderTop: "1px solid #ffe9f5", padding: "4px 0", margin: "4px 0" }}>
              <div className="d-flex"><span>{v?.type == 1 ? "Car" : "Motorcycle"}:</span>{v?.mode}</div>
              <div className="d-flex"><span>distance:</span>{v?.distance}</div>
              <div className="d-flex"><span>duration:</span>{v?.duration}</div>
            </div>) : null}

            {/* <div className="d-flex"><span>View services:</span></div> */}
            {/* {moment(block_slot?.retry_time).tz('Asia/Kolkata').format('LT')} */}
            {/* {moment().tz('Asia/Kolkata').isAfter(moment(block_slot?.retry_time).tz('Asia/Kolkata')) ? "ss" : "hh"} */}
            af&nbsp;{moment(block_slot?.retry_time).tz('Asia/Kolkata').format('LT')}
            &nbsp;|&nbsp;
            bl&nbsp;{moment(block_slot?.block_time).tz('Asia/Kolkata').format('LT')}
            {startCountdown(block_slot?.block_time)}

            <div className="mt-2 gap-2" style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              {status_code == 6 ?
                moment().tz('Asia/Kolkata').isAfter(moment(block_slot?.retry_time).tz('Asia/Kolkata')) ?
                  <>
                    <div
                      className={moment().tz('Asia/Kolkata').isBefore(moment(block_slot?.block_time).tz('Asia/Kolkata')) ? `re-order` : `re-order-disabled`}
                      onClick={() => { moment().tz('Asia/Kolkata').isBefore(moment(block_slot?.block_time).tz('Asia/Kolkata')) ? checkOutConfirm(data) : console.log("no retry") }}
                    >
                      Retry
                    </div>
                  </>
                  : <></>
                : status_code == 2 ? <a
                  target="_blank"
                  href={`https://www.google.com/maps/dir/${+booking_metadata?.geo_location?.lat},${+booking_metadata?.geo_location?.lng}/${+data?.branch?.location?.coordinates[1]},${+data?.branch?.location?.coordinates[0]}`}
                  className={`re-order`}
                >
                  Direction
                </a>
                  :
                  null}
              <div
                // href="#"
                className={status_code == 4 || status_code == 2 || status_code == 6 ? `cancel-order` : ``}
                onClick={(e) => {
                  status_code == 4 || status_code == 2 || status_code == 6
                    ? handelCancel(e, _id, index)
                    : null;
                }}
              >
                {status_code == 4 || status_code == 2 || status_code == 6
                  ? "Cancel"
                  : ""}
              </div>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
};

export default OrderCards;