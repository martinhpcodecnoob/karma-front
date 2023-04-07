import React, { useState } from "react";
import CommentsAndRatings from "./CommentsAndRatings";
import CommentsPage from "./CommentsPage";

export default function OrderCard(props) {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };
  const [inProcess, setInProcess] = useState(true);
  const [sent, setSent] = useState(true);
  const [delivered, setDelivered] = useState(true);
  return (
    <section className="bg-[#171717] mx-auto w-8/12 h-96 rounded-2xl">
      <section className="w-full   h-72 text-white flex mt-4 b">
        <img
          className=" rounded-br-2xl rounded-tl-xl w-4/12 h-72"
          src="https://m.media-amazon.com/images/I/617Q3DbKyPL._AC_SL1500_.jpg"
          alt=""
        />
        <div className="flex flex-col items-center justify-evenly w-4/12">
          <h3>Nombre del producto</h3>
          <h3>precio$</h3>
        </div>
        {delivered === true ? (
          <div className="flex flex-col items-center justify-evenly text-center w-4/12">
            <h3>¡Pedido Entregado Correctamente!</h3>
            <div className="bg-gray-800 py-6 rounded-lg mx-2 text-md font-bold">
              <h3 className="mx-2">Dejanos tu opinion sobre el producto</h3>
              <button
                onClick={handleOpenPopup}
                className="bg-white text-[#171717] px-3 py-1 rounded-lg font-bold mt-4"
              >
                Dejar Valoración
              </button>
              {popupOpen && (
                <CommentsAndRatings
                  productId="123"
                  onClose={handleClosePopup}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-evenly w-4/12 mx-2">
            <p className="text-sm">
              En Karma, nos esforzamos por brindarle la mejor experiencia
              posible de compra en línea. Sin embargo, entendemos que a veces
              pueden surgir problemas con el envío de su pedido. Si por alguna
              razón no ha recibido su pedido en el plazo esperado o si ha
              recibido un producto dañado o incorrecto, por favor, no dude en
              ponerse en contacto con nosotros.
            </p>
            <div className="flex justify-evenly w-full">
              <a
                href="https://api.whatsapp.com/send?phone=3218828244"
                target="_blank"
                rel="noreferrer"
                re
              >
                <button className="bg-[#1AD03F] px-3 py-1 rounded-lg flex">
                  <svg
                    className="mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
                      fill="#BFC8D0"
                    />
                    <path
                      d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
                      fill="url(#paint0_linear_87_7264)"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
                      fill="white"
                    />
                    <path
                      d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_87_7264"
                        x1="26.5"
                        y1="7"
                        x2="4"
                        y2="28"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#5BD066" />
                        <stop offset="1" stop-color="#27B43E" />
                      </linearGradient>
                    </defs>
                  </svg>
                  Whatsapp
                </button>
              </a>
              <button
                onClick={handleOpenPopup}
                className="text-[#171717] bg-white px-3 py-1 rounded-lg"
              >
                Enviar Feedback
              </button>
              {popupOpen && <CommentsPage onClose={handleClosePopup} />}
            </div>
          </div>
        )}
      </section>
      <div className="w-full h-12 px-4 py-4">
        <div>
          <h2 class="sr-only">Steps</h2>

          <div>
            <div
              class={
                delivered === true
                  ? "overflow-hidden rounded-full bg-blue-500"
                  : "overflow-hidden rounded-full bg-gray-200"
              }
            >
              <div
                class={
                  sent === true
                    ? "h-2 w-1/2 rounded-full bg-blue-500"
                    : "h-2 w-1/2 rounded-full "
                }
              ></div>
            </div>

            <ol class="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
              <li
                class={
                  inProcess === true
                    ? "flex items-center justify-start text-blue-600"
                    : "flex items-center justify-start text-white"
                }
              >
                <span class="hidden sm:inline pr-2"> Procesando </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 1024 1024"
                  class="icon"
                  version="1.1"
                  fill="#1C64F2"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M768 85.333333H554.666667c0 23.466667-19.2 42.666667-42.666667 42.666667s-42.666667-19.2-42.666667-42.666667H256C209.066667 85.333333 170.666667 123.733333 170.666667 170.666667v682.666666c0 46.933333 38.4 85.333333 85.333333 85.333334h512c46.933333 0 85.333333-38.4 85.333333-85.333334V170.666667c0-46.933333-38.4-85.333333-85.333333-85.333334z"
                      fill={inProcess === true ? "#1C64F2" : "#FFFFFF"}
                    />

                    <path
                      d="M768 874.666667H256c-12.8 0-21.333333-8.533333-21.333333-21.333334V170.666667c0-12.8 8.533333-21.333333 21.333333-21.333334h512c12.8 0 21.333333 8.533333 21.333333 21.333334v682.666666c0 12.8-8.533333 21.333333-21.333333 21.333334z"
                      fill="#171717"
                    />

                    <path
                      d="M554.666667 85.333333c0 23.466667-19.2 42.666667-42.666667 42.666667s-42.666667-19.2-42.666667-42.666667h-149.333333v85.333334c0 23.466667 19.2 42.666667 42.666667 42.666666h298.666666c23.466667 0 42.666667-19.2 42.666667-42.666666V85.333333h-149.333333z"
                      fill="#90A4AE"
                    />

                    <path
                      d="M512 0c-46.933333 0-85.333333 38.4-85.333333 85.333333s38.4 85.333333 85.333333 85.333334 85.333333-38.4 85.333333-85.333334-38.4-85.333333-85.333333-85.333333z m0 128c-23.466667 0-42.666667-19.2-42.666667-42.666667s19.2-42.666667 42.666667-42.666666 42.666667 19.2 42.666667 42.666666-19.2 42.666667-42.666667 42.666667z"
                      fill="#90A4AE"
                    />

                    <path
                      d="M652.8 396.8l-192 192-89.6-91.733333-53.333333 53.333333 145.066666 142.933333 243.2-243.2z"
                      fill={inProcess === true ? "#1C64F2" : "#FFFFFF"}
                    />
                  </g>
                </svg>
              </li>

              <li
                class={
                  sent === true
                    ? "flex items-center justify-center text-blue-600"
                    : "flex items-center justify-center text-white"
                }
              >
                <span class="hidden sm:inline pr-2"> Enviado </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xlink="http://www.w3.org/1999/xlink"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="_x32_"
                  viewBox="0 0 512 512"
                  space="preserve"
                >
                  <g>
                    <path
                      fill={sent === true ? "#1C64F2" : "#FFFFFF"}
                      class="st0"
                      d="M311.069,130.515c-0.963-5.641-5.851-9.768-11.578-9.768H35.43c-7.61,0-13.772,6.169-13.772,13.765   c0,7.61,6.162,13.772,13.772,13.772h64.263c7.61,0,13.772,6.17,13.772,13.773c0,7.603-6.162,13.772-13.772,13.772H13.772   C6.169,175.829,0,181.998,0,189.601c0,7.603,6.169,13.764,13.772,13.764h117.114c6.72,0,12.172,5.46,12.172,12.18   c0,6.72-5.452,12.172-12.172,12.172H68.665c-7.61,0-13.772,6.17-13.772,13.773c0,7.602,6.162,13.772,13.772,13.772h45.857   c6.726,0,12.179,5.452,12.179,12.172c0,6.719-5.453,12.172-12.179,12.172H51.215c-7.61,0-13.772,6.169-13.772,13.772   c0,7.603,6.162,13.772,13.772,13.772h87.014l5.488,31.042h31.52c-1.854,4.504-2.911,9.421-2.911,14.598   c0,21.245,17.218,38.464,38.464,38.464c21.237,0,38.456-17.219,38.456-38.464c0-5.177-1.057-10.094-2.911-14.598h100.04   L311.069,130.515z M227.342,352.789c0,9.146-7.407,16.553-16.553,16.553c-9.152,0-16.56-7.407-16.56-16.553   c0-6.364,3.627-11.824,8.892-14.598h15.329C223.714,340.965,227.342,346.424,227.342,352.789z"
                    />
                    <path
                      fill={sent === true ? "#1C64F2" : "#FFFFFF"}
                      class="st0"
                      d="M511.598,314.072l-15.799-77.941l-57.689-88.759H333.074l32.534,190.819h38.42   c-1.846,4.504-2.904,9.421-2.904,14.598c0,21.245,17.219,38.464,38.456,38.464c21.246,0,38.464-17.219,38.464-38.464   c0-5.177-1.057-10.094-2.91-14.598h16.741c6.039,0,11.759-2.708,15.582-7.386C511.273,326.136,512.8,319.988,511.598,314.072z    M392.529,182.882h26.314l34.162,52.547h-51.512L392.529,182.882z M456.14,352.789c0,9.146-7.407,16.553-16.56,16.553   c-9.138,0-16.552-7.407-16.552-16.553c0-6.364,3.635-11.824,8.892-14.598h15.329C452.513,340.965,456.14,346.424,456.14,352.789z"
                    />
                  </g>
                </svg>
              </li>

              <li
                class={
                  delivered === true
                    ? "flex items-center justify-end text-blue-600"
                    : "flex items-center justify-end text-white"
                }
              >
                <span class="hidden sm:inline pr-2"> Entregado </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                  version="1.1"
                  id="Capa_1"
                  width="30px"
                  height="30px"
                  viewBox="0 0 612 612"
                  space="preserve"
                >
                  <g>
                    <path
                      fill={delivered === true ? "#1C64F2" : "#FFFFFF"}
                      d="M580.592,135.703L497.33,98.681L234.478,222.254v79.353l-45.854-20.389v-79.353L451.477,78.293l-88.287-39.256   c-11.822-5.256-31.166-5.256-42.987,0l-217.401,96.666c-17.319,7.701-31.453,29.51-31.409,48.464l0.339,143.238   c13.628-4.385,28.128-6.806,43.195-6.806c77.949,0,141.373,63.424,141.373,141.382c0,20.36-4.413,39.682-12.196,57.188   l76.764,32.815c11.436,4.888,30.146,4.889,41.583,0.002l216.905-92.694c17.614-7.527,32.062-29.357,32.107-48.513L612,184.166   C612.044,165.212,597.911,143.403,580.592,135.703z M496.655,300.16l29.458-62.149c2.974-6.273,10.429-9.892,13.413-6.49   l30.229,34.461c3.019,3.441-0.812,11.277-6.869,14.087l-12.724,5.903l-0.257,89.528c-0.012,3.912-3.467,8.569-7.708,10.399   l-19.049,8.223c-4.176,1.803-7.554,0.132-7.556-3.729l-0.064-88.354l-12.325,5.718C497.407,310.446,493.778,306.23,496.655,300.16z    M388.039,350.943l26.773-59.078c2.7-5.959,9.604-9.312,12.422-6.012l28.532,33.423c2.85,3.336-0.628,10.779-6.237,13.381   l-11.782,5.466l0.76,85.727c0.033,3.749-3.135,8.163-7.066,9.86l-17.664,7.625c-3.873,1.672-7.042,0.025-7.087-3.675l-1.035-84.647   l-11.429,5.302C388.852,360.808,385.422,356.718,388.039,350.943z M583.911,399.271c-0.014,1.967-1.781,4.298-3.946,5.208   l-201.751,84.757c-1.883,0.791-3.432-0.037-3.459-1.851l-0.155-9.861c-0.028-1.817,1.476-3.942,3.361-4.745l202.111-86.097   c2.17-0.924,3.92-0.075,3.908,1.896L583.911,399.271z M114.925,347.054C51.454,347.054,0,398.508,0,461.979   c0,63.472,51.454,114.926,114.925,114.926s114.925-51.454,114.925-114.926C229.851,398.508,178.396,347.054,114.925,347.054z    M190.021,438.367l-70.724,79.563c-3.484,3.919-8.335,5.932-13.221,5.932c-3.881,0-7.783-1.27-11.038-3.877l-44.202-35.361   c-7.624-6.095-8.862-17.223-2.759-24.846c6.095-7.632,17.228-8.867,24.851-2.763l31.093,24.872l59.574-67.02   c6.479-7.295,17.659-7.959,24.958-1.468C195.853,419.893,196.509,431.063,190.021,438.367z"
                    />
                  </g>
                </svg>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
