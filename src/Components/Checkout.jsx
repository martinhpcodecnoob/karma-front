import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import CartCard from "./CartCard";
import CheckOutCard from "./CheckOutCard";
import MyData from "./MyData";
import MyDataCheckOut from "./MyDataCheckOut";
import { Navigate } from "react-router-dom";
import LoadingCheckout from "./LoadingCheckout";

export default function Checkout() {
  const [isDataComplete, setisDataComplete] = useState(null);
  const [cartProducts, setCartProducts] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [idOrder, setIdOrder] = useState(null);
  function getIdOrdenCreada(orders) {
    for (let i = 0; i < orders.length; i++) {
      if (
        orders[i].orderStatus === "Orden Creada" ||
        orders[i].orderStatus === "Procesando Orden"
      ) {
        return orders[i].id;
      }
    }
    return null; // Si no se encuentra ninguna orden con orderStatus "Orden Creada"
  }
  const [redirectUrl, setRedirectUrl] = useState(false);
  const { user } = useAuth0();
  const idUser = user?.sub;
  let total = 0;
  const [myData, setMyData] = useState("");
  const getDataCheck = async () => {
    const res = await axios.get(`/user/getUser?id=${user?.sub}`);
    setMyData(res.data);
    if (
      res.data?.address !== "none" &&
      res.data?.city !== "none" &&
      res.data?.phoneNumber !== "none" &&
      res.data?.lastName !== "none" &&
      res.data?.name !== "none"
    ) {
      setisDataComplete(true);
      try {
        const res = await axios.post("/order/createOrder", {
          idUser: user?.sub,
        });
        setIdOrder(res.data.id);
      } catch (error) {
        const resId = await axios.get(`/user/getOrdersByUserId?id=${user.sub}`);
        console.log(resId.data.Orders);
        setIdOrder(getIdOrdenCreada(resId.data.Orders));
      }
    } else {
      setisDataComplete(false);
    }
  };

  const getData = async () => {
    const res = await axios.get(`/user/getUser?id=${user?.sub}`);
    setMyData(res.data);
  };
  useEffect(() => {
    if (user?.sub) {
      getData();
    }
  }, [user?.sub]);
  console.log(idOrder);
  useEffect(() => {
    async function fetchData(id) {
      const response = await axios.get(
        `/product/getProductsFromUserShoppingCart?id=${id}`
      );
      const data = response.data;
      setCartProducts(data);

      data.forEach((product) => {
        product.pricePerUnit = product.Product.price * product.amount;
        return (total += product.pricePerUnit);
      });
      setTotalPrice(total);
    }
    fetchData(idUser);
  }, [user?.sub, total]);
  const loadingRef = useRef();
  const createOrderPaypal = async () => {
    loadingRef.current.togglePopUp();

    try {
      const res = await axios.post("/payments/createOrderPaypal", {
        userId: user?.sub,
        orderId: idOrder,
      });

      window.location.href = res.data.href;
      setRedirectUrl(res.data.href);
    } catch (error) {
      console.log(error);
    }
  };
  const createOrderMercadoPago = async () => {
    loadingRef.current.togglePopUp();
    try {
      const res = await axios.post("/payments/mercadoPago", {
        userId: user?.sub,
        orderId: idOrder,
      });
      window.location.href = res.data;
      setRedirectUrl(res.data);
    } catch (error) {
      console.log(error);
    }
    // The ".checkout" is the function that creates the connection between the button and the platform
  };

  return (
    <section>
      <NavBar />
      <LoadingCheckout ref={loadingRef}></LoadingCheckout>
      {cartProducts && cartProducts.length < 1 ? (
        <></>
      ) : (
        <div class="mx-auto h-[600px]  max-w-screen-2xl w-full flex  justify-between">
          <div class="bg-white border-[#D4D4D4] border-r-[1px] py-12 w-[50%] md:py-10">
            <div class="mx-auto max-w-lg space-y-8 px-4 lg:px-8">
              <div>
                <p class="text-2xl font-thin tracking-tight text-black">
                  TOTAL: ${totalPrice}
                </p>

                <p class="mt-1 text-sm font-thin text-black">
                  Por la compra de
                </p>
              </div>

              <div className="">
                <div class="flow-root">
                  <ul class=" divide-gray-100">
                    {cartProducts?.map((product) => {
                      return (
                        <CheckOutCard
                          images={product.Product.images[0]}
                          amount={product.amount}
                          model={product.Product.model}
                          priceXProduct={product.pricePerUnit}
                        ></CheckOutCard>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white w-full flex flex-col items-center justify-center">
            <MyDataCheckOut></MyDataCheckOut>
            <button
              className="m-2 bg-white border border-neutral-900 text-neutral-900 py-2 px-4 rounded-sm hover:bg-neutral-900 hover:text-white"
              onClick={getDataCheck}
            >
              Ver metodos de pago
            </button>
            <div className="flex w-full justify-evenly">
              {isDataComplete === false ? (
                <div className="flex justify-center items-center">
                  <h3 className="text-red-600 font-normal text-md text-center">
                    Tienes datos que no has rellenado aún, por favor completa
                    todos tus datos y vuelve a presionar "Ver metodos de pago"
                  </h3>
                </div>
              ) : (
                <>
                  {isDataComplete === null ? (
                    <></>
                  ) : (
                    <>
                      {isDataComplete === true ? (
                        <>
                          {idOrder && (
                            <div className="my-2">
                              <button
                                onClick={createOrderMercadoPago}
                                className="bg-white text-black  flex items-center justify-between border border-neutral-900 hover:bg-[#171717] hover:text-white  py-2 px-4 rounded-sm w-[320px] h-[60px]"
                              >
                                PAGAR CON MERCADO PAGO
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  width="60px"
                                  height="50px"
                                >
                                  <ellipse
                                    cx="23.5"
                                    cy="23.5"
                                    fill="#4fc3f7"
                                    rx="21.5"
                                    ry="15.5"
                                  />
                                  <path
                                    fill="#fafafa"
                                    d="M22.471,24.946c-1.978-5.537-4.884-10.881-6.085-12.995c-0.352-0.619-0.787-1.186-1.29-1.69 l-2.553-2.553c-0.391-0.391-1.414,0-1.414,0L9.497,8.734l-0.162,2.319L8.773,11c-0.518,0-0.938,0.42-0.938,0.938 c0,0.52,0.413,0.969,0.933,0.961c1.908-0.03,3.567,1.601,3.567,1.601h2c0.32,0.32,1.139,1.366,1.328,2.439 c0.107,0.611,0.154,1.229,0.119,1.848C15.458,24.622,16.835,26,16.835,26c-5.5-3.5-14.819-2.964-14.819-2.964l0.193,3.016L5,31 c0.919,0.212,0.744-0.626,1.765-0.504c6.199,0.741,13.57,0.004,13.57,0.004c1.5,0,1.958-0.793,2.665-1.5 C24,28,22.849,26.004,22.471,24.946z"
                                  />
                                  <path
                                    fill="#fafafa"
                                    d="M24.913,24.946c1.978-5.537,4.884-10.881,6.085-12.995c0.352-0.619,0.787-1.186,1.29-1.69 l2.553-2.553c0.391-0.391,1.414,0,1.414,0L37.814,9l0.235,2.053L38.611,11c0.518,0,0.938,0.42,0.938,0.938 c0,0.52-0.413,0.969-0.933,0.961c-1.908-0.03-3.567,1.601-3.567,1.601h-2c-0.32,0.32-1.139,1.366-1.328,2.439 c-0.107,0.611-0.154,1.229-0.119,1.848C31.926,24.622,30.549,26,30.549,26c5.5-3.5,15-3,15-3l-0.165,3l-3,5 c-0.919,0.212-0.744-0.626-1.765-0.504c-6.199,0.741-13.57,0.004-13.57,0.004c-1.5,0-1.958-0.793-2.665-1.5 C23.384,28,24.535,26.004,24.913,24.946z"
                                  />
                                  <path
                                    fill="#1a237e"
                                    d="M43.832,16.326c-0.311-0.415-0.644-0.808-0.992-1.187c-0.059-0.064-0.123-0.123-0.183-0.186 c-0.309-0.326-0.628-0.639-0.96-0.938c-0.026-0.023-0.053-0.045-0.079-0.068c-0.587-0.522-1.201-1.012-1.845-1.454 c0.071-0.175,0.11-0.364,0.11-0.555c0-0.792-0.643-1.437-1.481-1.437c-0.001,0-0.003,0-0.004,0l-0.015,0.002V9.32 c0-0.534-0.288-1.032-0.75-1.299L36.269,7.24c-0.221-0.085-1.356-0.478-1.946,0.113l-1.837,1.838 c-0.381-0.106-0.89-0.25-1.211-0.326C28.893,8.288,26.446,8.014,24,8c-3.031-0.004-6.095,0.39-9.018,1.275l-1.921-1.921 c-0.59-0.59-1.725-0.199-2.018-0.079L9.75,8.021C9.288,8.288,9,8.786,9,9.32v1.186L8.938,10.5c-0.793,0-1.438,0.646-1.438,1.438 c0,0.311,0.103,0.614,0.283,0.865c-0.978,0.715-1.903,1.512-2.722,2.422c-0.315,0.35-0.616,0.715-0.9,1.096 C2.638,18.346,2.061,20.87,2,23.5c-0.035,2.628,0.455,5.223,1.932,7.343c1.478,2.132,3.451,3.854,5.624,5.163 c4.378,2.609,9.436,3.749,14.444,3.846c2.511-0.026,5.023-0.319,7.471-0.924c2.442-0.624,4.81-1.582,6.986-2.9 c2.163-1.328,4.143-3.041,5.617-5.18c1.476-2.122,1.932-4.719,1.894-7.347C45.905,20.87,45.357,18.348,43.832,16.326z M40.793,15.139c0.229,0.225,0.448,0.459,0.662,0.697c0.096,0.107,0.195,0.211,0.288,0.32c0.293,0.347,0.573,0.703,0.828,1.076 c1.088,1.579,1.785,3.39,1.957,5.242c-2.274-0.031-8.444,0.114-13.042,2.342c0.335-1.133,0.619-3.016,0.449-6.058 c-0.03-0.552,0.008-1.135,0.113-1.733c0.139-0.79,0.702-1.618,1.054-2.026h0.727c0.731,0,1.432-0.224,2.025-0.647 c0.624-0.444,1.559-0.981,2.588-0.954c0.072,0,0.139-0.03,0.21-0.04c0.267,0.192,0.536,0.383,0.792,0.587 c0.076,0.061,0.15,0.124,0.225,0.186c0.273,0.224,0.538,0.457,0.795,0.696C40.576,14.93,40.686,15.034,40.793,15.139z M24,9 c2.369,0.026,4.734,0.303,7.027,0.87c0.208,0.053,0.412,0.118,0.617,0.181c-0.482,0.503-0.906,1.054-1.246,1.652 c-1.175,2.068-4.124,7.483-6.121,13.075c-0.075,0.208-0.163,0.43-0.255,0.66c-0.112,0.281-0.226,0.572-0.331,0.868 c-0.104-0.296-0.219-0.588-0.331-0.868c-0.092-0.23-0.18-0.452-0.255-0.66c-2-5.599-4.947-11.009-6.121-13.075 c-0.297-0.523-0.667-1.004-1.074-1.456C18.522,9.461,21.264,9.054,24,9z M5.435,17.238c0.251-0.364,0.524-0.713,0.811-1.052 c0.094-0.112,0.196-0.218,0.294-0.327c0.202-0.225,0.408-0.448,0.625-0.662c0.115-0.114,0.233-0.224,0.351-0.335 c0.229-0.213,0.463-0.421,0.704-0.622c0.099-0.083,0.198-0.166,0.299-0.247c0.243-0.193,0.495-0.376,0.748-0.558 c0.886,0.089,1.707,0.522,2.262,0.918C12.123,14.776,12.823,15,13.555,15h0.727c0.352,0.407,0.915,1.235,1.054,2.026 c0.105,0.597,0.143,1.18,0.113,1.733c-0.17,3.042,0.114,4.927,0.449,6.059c-4.193-2.029-9.734-2.333-12.425-2.344 C3.648,20.623,4.346,18.814,5.435,17.238z M6.236,30.271c-0.192-0.224-0.396-0.437-0.572-0.673 C4.329,27.826,3.49,25.705,3.426,23.5c0-0.008,0.001-0.017,0.001-0.025c2.878,0.006,9.226,0.351,13.305,2.947 c0.211,0.134,0.484,0.088,0.646-0.104c0.162-0.19,0.153-0.477-0.014-0.662c-0.012-0.014-1.218-1.422-0.916-6.842 c0.035-0.63-0.007-1.29-0.126-1.962c-0.218-1.235-1.133-2.372-1.467-2.706C14.76,14.053,14.632,14,14.5,14h-0.945 c-0.522,0-1.021-0.159-1.445-0.462c-0.745-0.531-1.925-1.147-3.185-1.14c-0.131,0.004-0.226-0.063-0.281-0.117 C8.552,12.192,8.5,12.067,8.5,11.938c0-0.242,0.196-0.438,0.391-0.44l0.562,0.054c0.111,0.007,0.216-0.027,0.308-0.084l0.386,0.386 C10.242,11.949,10.37,12,10.5,12c0.053,0,0.106-0.009,0.158-0.025l1.207-0.402l1.281,1.281C13.244,12.951,13.372,13,13.5,13 s0.256-0.049,0.354-0.146c0.195-0.195,0.195-0.512,0-0.707L12.707,11l0.146-0.146C12.951,10.756,13,10.628,13,10.5 s-0.049-0.256-0.146-0.354l-1-1c-0.195-0.195-0.512-0.195-0.707,0C11.049,9.244,11,9.372,11,9.5s0.049,0.256,0.146,0.354 l0.646,0.646l-0.063,0.063l-1.095,0.365L10,10.293V9.32c0-0.178,0.096-0.344,0.25-0.434l1.22-0.712 c0.365-0.139,0.792-0.179,0.883-0.114l2.554,2.554c0.475,0.475,0.882,1.007,1.209,1.583c1.161,2.043,4.076,7.393,6.049,12.917 c0.078,0.219,0.171,0.452,0.267,0.694c0.347,0.871,0.741,1.858,0.58,2.583C22.808,29.309,21.728,30,20.49,30 c-0.07,0.002-7.123,0.139-13.425,0.011C6.798,30.002,6.509,30.114,6.236,30.271z M37.217,33.918 c-1.98,1.119-4.156,1.898-6.385,2.419c-2.228,0.539-4.528,0.798-6.832,0.812c-4.592,0.01-9.259-0.951-13.23-3.208 c-1.401-0.799-2.709-1.764-3.832-2.891c0.036-0.014,0.083-0.038,0.107-0.039C13.367,31.138,20.439,31.001,20.5,31 c1.396,0,2.616-0.673,3.192-1.67c0.575,0.997,1.794,1.67,3.182,1.67c0.071,0.002,7.146,0.139,13.462,0.011 c0.089,0.003,0.272,0.102,0.483,0.249C39.748,32.289,38.531,33.185,37.217,33.918z M42.329,29.593 c-0.247,0.329-0.526,0.635-0.803,0.941c-0.37-0.273-0.81-0.524-1.192-0.524c-0.005,0-0.011,0-0.017,0 c-6.3,0.125-13.354-0.01-13.434-0.011c-1.228,0-2.308-0.691-2.512-1.608c-0.161-0.725,0.232-1.712,0.58-2.583 c0.096-0.242,0.189-0.476,0.267-0.694c1.971-5.518,4.887-10.871,6.049-12.917c0.327-0.576,0.734-1.108,1.209-1.583l2.55-2.551 C35.122,8,35.548,8.037,35.841,8.14l1.293,0.747c0.154,0.09,0.25,0.256,0.25,0.434v0.973l-0.635,0.635l-1.095-0.365L35.591,10.5 l0.646-0.646c0.098-0.098,0.146-0.226,0.146-0.354s-0.049-0.256-0.146-0.354c-0.195-0.195-0.512-0.195-0.707,0l-1,1 c-0.098,0.098-0.146,0.226-0.146,0.354s0.049,0.256,0.146,0.354L34.677,11l-1.146,1.146c-0.195,0.195-0.195,0.512,0,0.707 C33.628,12.951,33.756,13,33.884,13s0.256-0.049,0.354-0.146l1.281-1.281l1.207,0.402C36.777,11.991,36.831,12,36.884,12 c0.13,0,0.258-0.051,0.354-0.146l0.386-0.386c0.092,0.057,0.197,0.092,0.308,0.084l0.515-0.052c0.242,0,0.438,0.196,0.438,0.438 c0,0.129-0.052,0.254-0.143,0.343c-0.056,0.055-0.157,0.109-0.282,0.117c-1.279,0.011-2.439,0.608-3.185,1.14 C34.851,13.841,34.352,14,33.83,14h-0.946c-0.133,0-0.26,0.053-0.354,0.146c-0.334,0.334-1.25,1.473-1.467,2.706 c-0.118,0.674-0.161,1.334-0.126,1.963c0.302,5.419-0.904,6.827-0.907,6.831c-0.18,0.181-0.196,0.468-0.037,0.666 c0.159,0.199,0.442,0.246,0.659,0.109c4.408-2.805,11.576-2.969,13.922-2.942c0,0.007,0.001,0.013,0.001,0.02 C44.507,25.705,43.666,27.824,42.329,29.593z"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                          {idOrder && (
                            <div className="my-2">
                              <button
                                onClick={createOrderPaypal}
                                className="bg-white text-black  flex items-center justify-between border border-neutral-900 hover:bg-[#171717] hover:text-white  py-2 px-4 rounded-sm w-[320px] h-[60px]"
                              >
                                PAGAR CON PAYPAL
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  xlink="http://www.w3.org/1999/xlink"
                                  version="1.1"
                                  id="Layer_1"
                                  x="0px"
                                  y="0px"
                                  width="124px"
                                  height="33px"
                                  viewBox="0 0 124 33"
                                  enable-background="new 0 0 124 33"
                                  space="preserve"
                                >
                                  <path
                                    fill="#253B80"
                                    d="M46.211,6.749h-6.839c-0.468,0-0.866,0.34-0.939,0.802l-2.766,17.537c-0.055,0.346,0.213,0.658,0.564,0.658  h3.265c0.468,0,0.866-0.34,0.939-0.803l0.746-4.73c0.072-0.463,0.471-0.803,0.938-0.803h2.165c4.505,0,7.105-2.18,7.784-6.5  c0.306-1.89,0.013-3.375-0.872-4.415C50.224,7.353,48.5,6.749,46.211,6.749z M47,13.154c-0.374,2.454-2.249,2.454-4.062,2.454  h-1.032l0.724-4.583c0.043-0.277,0.283-0.481,0.563-0.481h0.473c1.235,0,2.4,0,3.002,0.704C47.027,11.668,47.137,12.292,47,13.154z"
                                  />
                                  <path
                                    fill="#253B80"
                                    d="M66.654,13.075h-3.275c-0.279,0-0.52,0.204-0.563,0.481l-0.145,0.916l-0.229-0.332  c-0.709-1.029-2.29-1.373-3.868-1.373c-3.619,0-6.71,2.741-7.312,6.586c-0.313,1.918,0.132,3.752,1.22,5.031  c0.998,1.176,2.426,1.666,4.125,1.666c2.916,0,4.533-1.875,4.533-1.875l-0.146,0.91c-0.055,0.348,0.213,0.66,0.562,0.66h2.95  c0.469,0,0.865-0.34,0.939-0.803l1.77-11.209C67.271,13.388,67.004,13.075,66.654,13.075z M62.089,19.449  c-0.316,1.871-1.801,3.127-3.695,3.127c-0.951,0-1.711-0.305-2.199-0.883c-0.484-0.574-0.668-1.391-0.514-2.301  c0.295-1.855,1.805-3.152,3.67-3.152c0.93,0,1.686,0.309,2.184,0.892C62.034,17.721,62.232,18.543,62.089,19.449z"
                                  />
                                  <path
                                    fill="#253B80"
                                    d="M84.096,13.075h-3.291c-0.314,0-0.609,0.156-0.787,0.417l-4.539,6.686l-1.924-6.425  c-0.121-0.402-0.492-0.678-0.912-0.678h-3.234c-0.393,0-0.666,0.384-0.541,0.754l3.625,10.638l-3.408,4.811  c-0.268,0.379,0.002,0.9,0.465,0.9h3.287c0.312,0,0.604-0.152,0.781-0.408L84.564,13.97C84.826,13.592,84.557,13.075,84.096,13.075z  "
                                  />
                                  <path
                                    fill="#179BD7"
                                    d="M94.992,6.749h-6.84c-0.467,0-0.865,0.34-0.938,0.802l-2.766,17.537c-0.055,0.346,0.213,0.658,0.562,0.658  h3.51c0.326,0,0.605-0.238,0.656-0.562l0.785-4.971c0.072-0.463,0.471-0.803,0.938-0.803h2.164c4.506,0,7.105-2.18,7.785-6.5  c0.307-1.89,0.012-3.375-0.873-4.415C99.004,7.353,97.281,6.749,94.992,6.749z M95.781,13.154c-0.373,2.454-2.248,2.454-4.062,2.454  h-1.031l0.725-4.583c0.043-0.277,0.281-0.481,0.562-0.481h0.473c1.234,0,2.4,0,3.002,0.704  C95.809,11.668,95.918,12.292,95.781,13.154z"
                                  />
                                  <path
                                    fill="#179BD7"
                                    d="M115.434,13.075h-3.273c-0.281,0-0.52,0.204-0.562,0.481l-0.145,0.916l-0.23-0.332  c-0.709-1.029-2.289-1.373-3.867-1.373c-3.619,0-6.709,2.741-7.311,6.586c-0.312,1.918,0.131,3.752,1.219,5.031  c1,1.176,2.426,1.666,4.125,1.666c2.916,0,4.533-1.875,4.533-1.875l-0.146,0.91c-0.055,0.348,0.213,0.66,0.564,0.66h2.949  c0.467,0,0.865-0.34,0.938-0.803l1.771-11.209C116.053,13.388,115.785,13.075,115.434,13.075z M110.869,19.449  c-0.314,1.871-1.801,3.127-3.695,3.127c-0.949,0-1.711-0.305-2.199-0.883c-0.484-0.574-0.666-1.391-0.514-2.301  c0.297-1.855,1.805-3.152,3.67-3.152c0.93,0,1.686,0.309,2.184,0.892C110.816,17.721,111.014,18.543,110.869,19.449z"
                                  />
                                  <path
                                    fill="#179BD7"
                                    d="M119.295,7.23l-2.807,17.858c-0.055,0.346,0.213,0.658,0.562,0.658h2.822c0.469,0,0.867-0.34,0.939-0.803  l2.768-17.536c0.055-0.346-0.213-0.659-0.562-0.659h-3.16C119.578,6.749,119.338,6.953,119.295,7.23z"
                                  />
                                  <path
                                    fill="#253B80"
                                    d="M7.266,29.154l0.523-3.322l-1.165-0.027H1.061L4.927,1.292C4.939,1.218,4.978,1.149,5.035,1.1  c0.057-0.049,0.13-0.076,0.206-0.076h9.38c3.114,0,5.263,0.648,6.385,1.927c0.526,0.6,0.861,1.227,1.023,1.917  c0.17,0.724,0.173,1.589,0.007,2.644l-0.012,0.077v0.676l0.526,0.298c0.443,0.235,0.795,0.504,1.065,0.812  c0.45,0.513,0.741,1.165,0.864,1.938c0.127,0.795,0.085,1.741-0.123,2.812c-0.24,1.232-0.628,2.305-1.152,3.183  c-0.482,0.809-1.096,1.48-1.825,2c-0.696,0.494-1.523,0.869-2.458,1.109c-0.906,0.236-1.939,0.355-3.072,0.355h-0.73  c-0.522,0-1.029,0.188-1.427,0.525c-0.399,0.344-0.663,0.814-0.744,1.328l-0.055,0.299l-0.924,5.855l-0.042,0.215  c-0.011,0.068-0.03,0.102-0.058,0.125c-0.025,0.021-0.061,0.035-0.096,0.035H7.266z"
                                  />
                                  <path
                                    fill="#179BD7"
                                    d="M23.048,7.667L23.048,7.667L23.048,7.667c-0.028,0.179-0.06,0.362-0.096,0.55  c-1.237,6.351-5.469,8.545-10.874,8.545H9.326c-0.661,0-1.218,0.48-1.321,1.132l0,0l0,0L6.596,26.83l-0.399,2.533  c-0.067,0.428,0.263,0.814,0.695,0.814h4.881c0.578,0,1.069-0.42,1.16-0.99l0.048-0.248l0.919-5.832l0.059-0.32  c0.09-0.572,0.582-0.992,1.16-0.992h0.73c4.729,0,8.431-1.92,9.513-7.476c0.452-2.321,0.218-4.259-0.978-5.622  C24.022,8.286,23.573,7.945,23.048,7.667z"
                                  />
                                  <path
                                    fill="#222D65"
                                    d="M21.754,7.151c-0.189-0.055-0.384-0.105-0.584-0.15c-0.201-0.044-0.407-0.083-0.619-0.117  c-0.742-0.12-1.555-0.177-2.426-0.177h-7.352c-0.181,0-0.353,0.041-0.507,0.115C9.927,6.985,9.675,7.306,9.614,7.699L8.05,17.605  l-0.045,0.289c0.103-0.652,0.66-1.132,1.321-1.132h2.752c5.405,0,9.637-2.195,10.874-8.545c0.037-0.188,0.068-0.371,0.096-0.55  c-0.313-0.166-0.652-0.308-1.017-0.429C21.941,7.208,21.848,7.179,21.754,7.151z"
                                  />
                                  <path
                                    fill="#253B80"
                                    d="M9.614,7.699c0.061-0.393,0.313-0.714,0.652-0.876c0.155-0.074,0.326-0.115,0.507-0.115h7.352  c0.871,0,1.684,0.057,2.426,0.177c0.212,0.034,0.418,0.073,0.619,0.117c0.2,0.045,0.395,0.095,0.584,0.15  c0.094,0.028,0.187,0.057,0.278,0.086c0.365,0.121,0.704,0.264,1.017,0.429c0.368-2.347-0.003-3.945-1.272-5.392  C20.378,0.682,17.853,0,14.622,0h-9.38c-0.66,0-1.223,0.48-1.325,1.133L0.01,25.898c-0.077,0.49,0.301,0.932,0.795,0.932h5.791  l1.454-9.225L9.614,7.699z"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </section>
  );
}
