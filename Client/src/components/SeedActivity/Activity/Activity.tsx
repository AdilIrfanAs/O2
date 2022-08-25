import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "./activity.css";
import InputGroup from "react-bootstrap/InputGroup";
import { allActivity } from "../../../utils/api/Web3.api";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "react-bootstrap";
import FullPageLoader from "../../Loader/Loader";
import { toast } from "react-toastify";

const Activity = (props: any) => {

  //states

  const [activityData, setActivityData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [walletId, setWalletId] = useState(null);
  const [loader, setLoader] = useState<boolean>(false);

  //fetchAll activities

  const getAllActivities = async (walletId: number) => {
    const activitiesResponse = await allActivity(walletId, 1);
    setActivityData(activitiesResponse?.activity);
    setCurrentPage(activitiesResponse.pagination.page);
    setTotalPage(activitiesResponse.pagination.pages);
    setLoader(false);
  };

  //fetch next page activities
  const nextPage = async () => {
    setCurrentPage(currentPage + 1);
    if (currentPage >= 1 && currentPage <= totalPage) {
      setLoader(true);
      const activitiesResponse = await allActivity(walletId, currentPage + 1);
      setActivityData(activitiesResponse.activity);
      setLoader(false);
    }
  };
  //fetch prevPage activities

  const prevPage = async () => {
    setCurrentPage(currentPage - 1);
    if (currentPage >= 1) {
      setLoader(true);
      const activitiesResponse = await allActivity(walletId, currentPage - 1);
      setActivityData(activitiesResponse.activity);
      setLoader(false);
    }
  };



  const changePage = async (number: number) => {
    if (currentPage === number) return;
    setCurrentPage(number);
  };

  const onPageNumberClick = async (pageNumber: number) => {
    changePage(pageNumber);
    setLoader(true);
    const activitiesResponse = await allActivity(walletId, pageNumber);
    setActivityData(activitiesResponse.activity);
    setLoader(false);
  };

  let isPageNumberOutOfRange: boolean;

  const pageNumbers = [...new Array(totalPage)].map((_, index) => {
    const pageNumber = index + 1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === totalPage;
    const isCurrentPageWithinTwoPageNumbers =
      Math.abs(pageNumber - currentPage) <= 1;

    if (
      isPageNumberFirst ||
      isPageNumberLast ||
      isCurrentPageWithinTwoPageNumbers
    ) {
      isPageNumberOutOfRange = false;
      return (
        <Pagination.Item
          key={pageNumber}
          onClick={() => onPageNumberClick(pageNumber)}
          active={pageNumber === currentPage}
          className="paging-num"
        >
          <button>{pageNumber}</button>
        </Pagination.Item>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return <Pagination.Ellipsis key={pageNumber} className="muted" />;
    }

    return null;
  });


  useEffect(() => {
    let Wallets = JSON.parse(localStorage.getItem("Wallets"));
    let id: number = Wallets?.wallet?._id;
    setWalletId(id);
    if (id) {
      getAllActivities(id);
    } else if (props.LoggedIn === true) {
      getAllActivities(id);
    }
  }, [props.LoggedIn]);

  useEffect(() => {
    if (props.LoggedOut === true) {
      setActivityData(null);
      setTotalPage(null);
      setCurrentPage(null);
    }
  }, [props.LoggedOut]);
  return (
    <>
      {loader ? <FullPageLoader /> : null}
      <div className="activity">
        <div className="paging-table">
          <Table responsive>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>item</th>
                <th>from</th>
                <th>to</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {activityData && activityData.length > 0 ? (
                activityData.map((data, index: number) => {
                  return (
                    <tr key={index}>
                      <td>
                        <p>{data?.title}</p>
                      </td>
                      <td>
                        {data?.imageUrl ? (
                          <div className="d-flex align-items-center">
                            <img
                              src={data?.imageUrl}
                              className="pe-2"
                              width="70px"
                            />
                            <p className="w-td pe-3">{data?.name}</p>
                            <p className="w-td">{data?.serialNumber}</p>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            <p className="w-td">{data?.item}</p>
                          </div>
                        )}
                      </td>
                      <td>
                        <p
                          className="text-capitalize ellipse-text2"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.from);
                            toast.success("copied");
                          }}
                        >
                          {data?.from}
                        </p>
                      </td>
                      <td>
                        <p
                          className="text-capitalize ellipse-text2"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.to);
                            toast.success("copied");
                          }}
                        >
                          {data?.to}
                        </p>
                      </td>
                      <td>
                        <p className="w-td">
                          {" "}
                          {moment(data.createdAt).fromNow()}
                        </p>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div
                  className="alert nft-alert mb-0"
                  role="alert"
                >
                  <div className="dropdown-button--bg text-center d-inline-block">
                    <div className="img-input text-center w-100">
                      <span className="text-danger p-lg">No Activity Found</span>
                    </div>
                  </div>
                </div>
              )}
            </tbody>
          </Table>
          <InputGroup className="rows-per-page d-flex align-items-center justify-content-end justify-content-md-end justify-content-center">
            <div className="custom-pagination d-flex">
              <button
                className="prev-btn-seed me-lg-4 me-md-3 me-2"
                disabled={currentPage === 1 ? true : false}
                onClick={prevPage}
              >
                {" "}
                <FontAwesomeIcon className="angle-icon" icon={faAngleLeft} />
              </button>
              <ul className="d-flex justify-content-center">{pageNumbers}</ul>
              <button
                className="next-btn-seed ms-lg-4 ms-md-3 ms-2"
                disabled={currentPage === totalPage ? true : false}
                onClick={nextPage}
              >
                {" "}
                <FontAwesomeIcon
                  className="angle-icon"
                  icon={faAngleRight}
                />{" "}
              </button>
            </div>
          </InputGroup>
        </div>
      </div>
    </>
  );
};

export default Activity;
