// import React, { useEffect, useState } from "react";
// import "./App.css";

// const App = () => {
//   const [orders, setOrders] = useState([]);
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedTable, setSelectedTable] = useState(1); // Default table 1
//   const [menuOption, setMenuOption] = useState("All Orders");
//   const [newOrderCount, setNewOrderCount] = useState(0);
//   const [pendingOrderCount, setPendingOrderCount] = useState(0);
//   const [tapAndCollectCount, setTapAndCollectCount] = useState(0);
//   const [dateFilter, setDateFilter] = useState("Today"); // Default to Today's orders

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch(`https://royalbangla-server.gofastapi.com/getOrders`);
//       if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//       const data = await response.json();
//       const sortedOrders = data.orders.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setOrders(sortedOrders);
//       setError("");
//       setNewOrderCount(sortedOrders.filter((order) => !order.isDelivered).length);
//       setPendingOrderCount(sortedOrders.filter((order) => !order.isDelivered).length);
//       setTapAndCollectCount(
//         sortedOrders.filter((order) => parseInt(order.tableNumber) === 0 && !order.isDelivered).length
//       );
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchReservations = async () => {
//     try {
//       const response = await fetch(`https://royalbangla-server.gofastapi.com/getReservations`);
//       if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//       const data = await response.json();
//       setReservations(data.reservations);
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     fetchReservations();
//     const intervalId = setInterval(fetchOrders, 10000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const filterOrdersByDate = () => {
//     const now = new Date();
//     let filteredOrders = orders;

//     if (dateFilter === "Today") {
//       filteredOrders = orders.filter(
//         (order) =>
//           new Date(order.createdAt).toDateString() === now.toDateString()
//       );
//     } else if (dateFilter === "Last 3 Days") {
//       const threeDaysAgo = new Date();
//       threeDaysAgo.setDate(now.getDate() - 3);
//       filteredOrders = orders.filter(
//         (order) => new Date(order.createdAt) >= threeDaysAgo
//       );
//     } else if (dateFilter === "Last 15 Days") {
//       const fifteenDaysAgo = new Date();
//       fifteenDaysAgo.setDate(now.getDate() - 15);
//       filteredOrders = orders.filter(
//         (order) => new Date(order.createdAt) >= fifteenDaysAgo
//       );
//     } else if (dateFilter === "Last Month") {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(now.getMonth() - 1);
//       filteredOrders = orders.filter(
//         (order) => new Date(order.createdAt) >= oneMonthAgo
//       );
//     }

//     return filteredOrders;
//   };

//   const handleMarkAsDelivered = async (orderId) => {
//     try {
//       const response = await fetch(`https://royalbangla-server.gofastapi.com/markAsDelivered`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ orderId }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order._id === orderId ? { ...order, isDelivered: true } : order
//           )
//         );
//         setPendingOrderCount((prevCount) => prevCount - 1);
//         setTapAndCollectCount((prevCount) =>
//           prevCount > 0 && orders.some((order) => order._id === orderId && parseInt(order.tableNumber) === 0)
//             ? prevCount - 1
//             : prevCount
//         );
//       } else {
//         throw new Error(data.error || "Error marking order as delivered");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const getTableStatus = (tableNumber) => {
//     const tableOrders = orders.filter(
//       (order) => parseInt(order.tableNumber) === tableNumber
//     );
//     return tableOrders.some((order) => !order.isDelivered) ? "pending" : "";
//   };

//   const renderOrders = () => {
//   const filteredOrders = filterOrdersByDate().filter(
//     (order) =>
//       (menuOption === "All Orders" || !order.isDelivered) &&
//       (menuOption === "Tap and Collect"
//         ? parseInt(order.tableNumber) === 0
//         : parseInt(order.tableNumber) === selectedTable)
//   );

//   return (
//     <table className="order-table">
//       <thead>
//         <tr>
//           {menuOption === "Tap and Collect" && <th>Email</th>}
//           {menuOption === "Tap and Collect" && <th>Token ID</th>}
//           <th>Dish</th>
//           <th>Quantity</th>
//           <th>Time</th>
//           <th>Date</th>
//           <th>Status</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {filteredOrders.map((order) => {
//           const date = new Date(order.createdAt);
//           return (
//             <>
//               {order.dishes.map((dish, idx) => (
//                 <tr key={`${order._id}-${idx}`}>
//                   {idx === 0 && menuOption === "Tap and Collect" && (
//                     <>
//                       <td rowSpan={order.dishes.length} className="bold-text">
//                         {order.email || "N/A"}
//                       </td>
//                       <td rowSpan={order.dishes.length} className="bold-text">
//                         {order.tokenId || "N/A"}
//                       </td>
//                     </>
//                   )}
//                   <td>{dish.name}</td>
//                   <td>{dish.quantity}</td>
//                   {idx === 0 && (
//                     <>
//                       <td rowSpan={order.dishes.length}>
//                         {date.toLocaleTimeString()}
//                       </td>
//                       <td rowSpan={order.dishes.length}>
//                         {date.toLocaleDateString()}
//                       </td>
//                       <td rowSpan={order.dishes.length}>
//                         {order.isDelivered ? "Delivered" : "Pending"}
//                       </td>
//                       <td rowSpan={order.dishes.length}>
//                         {!order.isDelivered && (
//                           <button
//                             className={`mark-delivered ${
//                               order.isDelivered ? "delivered" : "pending"
//                             }`}
//                             onClick={() => handleMarkAsDelivered(order._id)}
//                           >
//                             {order.isDelivered
//                               ? "Delivered"
//                               : "Mark as Delivered"}
//                           </button>
//                         )}
//                       </td>
//                     </>
//                   )}
//                 </tr>
//               ))}
//             </>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

      

//   return (
//     <div className="app-container">
//       <div className="sidebar">
//         <h2>Menu</h2>
//         <ul className="menu-list">
//           {["All Orders", "Undelivered Orders", "Tap and Collect", "Reservations"].map(
//             (item) => (
//               <li
//                 key={item}
//                 className={`menu-item ${menuOption === item ? "active" : ""}`}
//                 onClick={() => {
//                   setMenuOption(item);
//                   setSelectedTable(item === "Tap and Collect" ? null : 1);
//                 }}
//               >
//                 <span className="menu-icon">
//                   {item === "All Orders"
//                     ? "📦"
//                     : item === "Undelivered Orders"
//                     ? "⏳"
//                     : item === "Tap and Collect"
//                     ? "🛒"
//                     : "📅"}
//                 </span>
//                 {item}{" "}
//                 {item === "All Orders" && newOrderCount > 0 && (
//                   <span className="badge">{newOrderCount}</span>
//                 )}
//                 {item === "Undelivered Orders" && pendingOrderCount > 0 && (
//                   <span className="badge">{pendingOrderCount}</span>
//                 )}
//                 {item === "Tap and Collect" && tapAndCollectCount > 0 && (
//                   <span className="badge">{tapAndCollectCount}</span>
//                 )}
//               </li>
//             )
//           )}
//         </ul>
//         <div className="date-filters">
//           <h3>Filter by Date</h3>
//           <select
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//           >
//             <option value="Today">Today's Orders</option>
//             <option value="Last 3 Days">Last 3 Days</option>
//             <option value="Last 15 Days">Last 15 Days</option>
//             <option value="Last Month">Last Month</option>
//           </select>
//         </div>
//       </div>
//       <div className="main-content">
//         {menuOption === "Reservations" ? (
//           <div className="reservations-section">
//   <h2>Reservations</h2>
//   {loading ? (
//     <p className="loading">Loading...</p>
//   ) : error ? (
//     <p className="error">{error}</p>
//   ) : (
//     <table className="order-table">
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Email</th>
//           <th>Phone</th>
//           <th>No. of Persons</th>
//           <th>Date</th>
//           <th>Time</th>
//         </tr>
//       </thead>
//       <tbody>
//         {reservations.map((reservation, index) => (
//           <tr key={index}>
//             <td>{reservation.name}</td>
//             <td>{reservation.email || "N/A"}</td>
//             <td>{reservation.phone}</td>
//             <td>{reservation.persons}</td>
//             <td>{reservation.date}</td>
//             <td>{reservation.time}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div>

//         ) : (
//           <>
//             {menuOption !== "Tap and Collect" && (
//               <div className="tables-section">
//                 <h2>Tables</h2>
//                 <div className="table-grid">
//                   {Array.from({ length: 21 }, (_, i) => i + 1).map((table) => (
//                     <button
//                       key={table}
//                       className={`table-button ${getTableStatus(table)}`}
//                       onClick={() => setSelectedTable(table)}
//                     >
//                       Table {table}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="order-details">
//               {loading ? (
//                 <p className="loading">Loading...</p>
//               ) : error ? (
//                 <p className="error">{error}</p>
//               ) : (
//                 <>
//                   <h2>
//                     {menuOption} {selectedTable && `for Table ${selectedTable}`}
//                   </h2>
//                   {renderOrders()}
//                 </>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;





// import React, { useEffect, useState } from "react";
// import "./App.css";

// const App = () => {
//   const [orders, setOrders] = useState([]);
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedTable, setSelectedTable] = useState(1); // Default table 1
//   const [menuOption, setMenuOption] = useState("All Orders");
//   const [newOrderCount, setNewOrderCount] = useState(0);
//   const [pendingOrderCount, setPendingOrderCount] = useState(0);
//   const [tapAndCollectCount, setTapAndCollectCount] = useState(0);
//   const [dateFilter, setDateFilter] = useState("Today"); // Default to Today's orders

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch(`https://royalbangla-server.gofastapi.com/getOrders`);
//       if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//       const data = await response.json();
//       const sortedOrders = data.orders.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setOrders(sortedOrders);
//       setError("");
//       setNewOrderCount(sortedOrders.filter((order) => !order.isDelivered).length);
//       setPendingOrderCount(sortedOrders.filter((order) => !order.isDelivered).length);
//       setTapAndCollectCount(
//         sortedOrders.filter((order) => parseInt(order.tableNumber) === 0 && !order.isDelivered).length
//       );
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchReservations = async () => {
//     try {
//       const response = await fetch(`https://royalbangla-server.gofastapi.com/getReservations`);
//       if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//       const data = await response.json();
//       setReservations(data.reservations);
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     fetchReservations();
//     const intervalId = setInterval(fetchOrders, 10000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const filterOrdersByDate = () => {
//     const now = new Date();
//     let filteredOrders = orders;

//     if (dateFilter === "Today") {
//       filteredOrders = orders.filter(
//         (order) =>
//           new Date(order.createdAt).toDateString() === now.toDateString()
//       );
//     } else if (dateFilter === "Last 3 Days") {
//       const threeDaysAgo = new Date();
//       threeDaysAgo.setDate(now.getDate() - 3);
//       filteredOrders = orders.filter(
//         (order) => new Date(order.createdAt) >= threeDaysAgo
//       );
//     } else if (dateFilter === "Last 15 Days") {
//       const fifteenDaysAgo = new Date();
//       fifteenDaysAgo.setDate(now.getDate() - 15);
//       filteredOrders = orders.filter(
//         (order) => new Date(order.createdAt) >= fifteenDaysAgo
//       );
//     } else if (dateFilter === "Last Month") {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(now.getMonth() - 1);
//       filteredOrders = orders.filter(
//         (order) => new Date(order.createdAt) >= oneMonthAgo
//       );
//     }

//     return filteredOrders;
//   };

//   const handleMarkAsDelivered = async (orderId) => {
//     try {
//       const response = await fetch(`https://royalbangla-server.gofastapi.com/markAsDelivered`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ orderId }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order._id === orderId ? { ...order, isDelivered: true } : order
//           )
//         );
//         setPendingOrderCount((prevCount) => prevCount - 1);
//         setTapAndCollectCount((prevCount) =>
//           prevCount > 0 && orders.some((order) => order._id === orderId && parseInt(order.tableNumber) === 0)
//             ? prevCount - 1
//             : prevCount
//         );
//       } else {
//         throw new Error(data.error || "Error marking order as delivered");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const getTableStatus = (tableNumber) => {
//     const tableOrders = orders.filter(
//       (order) => parseInt(order.tableNumber) === tableNumber
//     );
//     return tableOrders.some((order) => !order.isDelivered) ? "pending" : "";
//   };

//   const handleSendTimeDetails = async (email, expectedTime, orderId) => {
//     if (!expectedTime) {
//       alert("Please select a valid time before sending!");
//       return;
//     }
 
//     try {
//       const response = await fetch("https://royalbangla-server.gofastapi.com/timeDetails", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, expectedTime }),
//       });
 
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Error sending time details");
//       }
 
//       // Save to sessionStorage to persist disabled state and stamped time
//       sessionStorage.setItem(`buttonDisabled-${orderId}`, "true");
//       sessionStorage.setItem(`expectedTime-${orderId}`, expectedTime);
 
//       // Update orders state to reflect the stamped time
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId
//             ? { ...order, expectedTime }
//             : order
//         )
//       );
 
//       alert("Time details sent successfully!");
//     } catch (err) {
//       alert(err.message);
//     }
//   };
 
 

//   // const isButtonDisabled = (orderId) => {
//     // return sessionStorage.getItem(`disabled-${orderId}`) === "true";
//   // };

//   const renderOrders = () => {
//   const filteredOrders = filterOrdersByDate().filter((order) => {
//     if (menuOption === "Tap and Collect") {
//       // Include all Tap and Collect orders regardless of delivery status
//       return parseInt(order.tableNumber) === 0;
//     }
//     if (menuOption === "All Orders") {
//       return selectedTable
//         ? parseInt(order.tableNumber) === selectedTable
//         : true; // Filter by selected table if a table is selected
//     }
//     if (menuOption === "Undelivered Orders") {
//       return (
//         !order.isDelivered &&
//         (selectedTable
//           ? parseInt(order.tableNumber) === selectedTable
//           : true) // Filter by selected table if a table is selected
//       );
//     }
//     // For other specific cases
//     return parseInt(order.tableNumber) === selectedTable;
//   });

//   return (
//     <table className="order-table">
//       <thead>
//         <tr>
//           {menuOption === "Tap and Collect" && <th>Email</th>}
//           {menuOption === "Tap and Collect" && <th>Token ID</th>}
//           <th>Dish</th>
//           <th>Quantity</th>
//           <th>Time</th>
//           <th>Date</th>
//           <th>Status</th>
//           {menuOption === "Tap and Collect" && <th>Expected Time</th>}
//           {menuOption === "Tap and Collect" && <th>Send</th>}
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {filteredOrders.map((order) => {
//           const date = new Date(order.createdAt);
//           const isButtonDisabled =
//             sessionStorage.getItem(`buttonDisabled-${order._id}`) === "true";
//           const stampedExpectedTime =
//             sessionStorage.getItem(`expectedTime-${order._id}`) ||
//             order.expectedTime;

//           return (
//             <>
//               {order.dishes.map((dish, idx) => (
//                 <tr key={`${order._id}-${idx}`}>
//                   {idx === 0 && menuOption === "Tap and Collect" && (
//                     <>
//                       <td rowSpan={order.dishes.length} className="bold-text">
//                         {order.email || "N/A"}
//                       </td>
//                       <td rowSpan={order.dishes.length} className="bold-text">
//                         {order.tokenId || "N/A"}
//                       </td>
//                     </>
//                   )}
//                   <td>{dish.name}</td>
//                   <td>{dish.quantity}</td>
//                   {idx === 0 && (
//                     <>
//                       <td rowSpan={order.dishes.length}>
//                         {date.toLocaleTimeString()}
//                       </td>
//                       <td rowSpan={order.dishes.length}>
//                         {date.toLocaleDateString()}
//                       </td>
//                       <td rowSpan={order.dishes.length}>
//                         <span
//                           className={`status ${
//                             order.isDelivered ? "delivered" : "pending"
//                           }`}
//                         >
//                           {order.isDelivered ? "Delivered" : "Pending"}
//                         </span>
//                       </td>
//                       {menuOption === "Tap and Collect" && (
//                         <>
//                           <td rowSpan={order.dishes.length}>
//                             {stampedExpectedTime ? (
//                               <span className="expected-time">
//                                 {stampedExpectedTime}
//                               </span>
//                             ) : (
//                               <select
//                                 className="select-expected-time"
//                                 defaultValue=""
//                                 onChange={(e) => {
//                                   const selectedTime = e.target.value;
//                                   sessionStorage.setItem(
//                                     `expectedTime-${order._id}`,
//                                     selectedTime
//                                   );
//                                   order.expectedTime = selectedTime;
//                                   setOrders([...orders]);
//                                 }}
//                                 disabled={
//                                   isButtonDisabled || order.isDelivered
//                                 }
//                               >
//                                 <option value="" disabled>
//                                   Select Time
//                                 </option>
//                                 <option value="10 min">10 min</option>
//                                 <option value="20 min">20 min</option>
//                                 <option value="30 min">30 min</option>
//                                 <option value="1 hr">1 hr</option>
//                               </select>
//                             )}
//                           </td>
//                           <td rowSpan={order.dishes.length}>
//                             <button
//                               className="send-button"
//                               onClick={() =>
//                                 handleSendTimeDetails(
//                                   order.email,
//                                   stampedExpectedTime || "",
//                                   order._id
//                                 )
//                               }
//                               disabled={
//                                 isButtonDisabled ||
//                                 !stampedExpectedTime ||
//                                 order.isDelivered
//                               }
//                             >
//                               {isButtonDisabled || order.isDelivered
//                                 ? "Sent"
//                                 : "Send"}
//                             </button>
//                           </td>
//                         </>
//                       )}
//                       <td rowSpan={order.dishes.length}>
//                         <button
//                           className={`mark-delivered ${
//                             order.isDelivered ? "delivered" : "pending"
//                           }`}
//                           onClick={() => handleMarkAsDelivered(order._id)}
//                           disabled={order.isDelivered}
//                         >
//                           {order.isDelivered
//                             ? "Delivered"
//                             : "Mark as Delivered"}
//                         </button>
//                       </td>
//                     </>
//                   )}
//                 </tr>
//               ))}
//             </>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

 
 
 

//   return (
//     <div className="app-container">
//       <div className="sidebar">
//         <h2>Menu</h2>
//         <ul className="menu-list">
//           {["All Orders", "Undelivered Orders", "Tap and Collect", "Reservations"].map(
//             (item) => (
//               <li
//                 key={item}
//                 className={`menu-item ${menuOption === item ? "active" : ""}`}
//                 onClick={() => {
//                   setMenuOption(item);
//                   setSelectedTable(item === "Tap and Collect" ? null : 1);
//                 }}
//               >
//                 <span className="menu-icon">
//                   {item === "All Orders"
//                     ? "📦"
//                     : item === "Undelivered Orders"
//                     ? "⏳"
//                     : item === "Tap and Collect"
//                     ? "🛒"
//                     : "📅"}
//                 </span>
//                 {item}{" "}
//                 {item === "All Orders" && newOrderCount > 0 && (
//                   <span className="badge">{newOrderCount}</span>
//                 )}
//                 {item === "Undelivered Orders" && pendingOrderCount > 0 && (
//                   <span className="badge">{pendingOrderCount}</span>
//                 )}
//                 {item === "Tap and Collect" && tapAndCollectCount > 0 && (
//                   <span className="badge">{tapAndCollectCount}</span>
//                 )}
//               </li>
//             )
//           )}
//         </ul>
//         <div className="date-filters">
//           <h3>Filter by Date</h3>
//           <select
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//           >
//             <option value="Today">Today's Orders</option>
//             <option value="Last 3 Days">Last 3 Days</option>
//             <option value="Last 15 Days">Last 15 Days</option>
//             <option value="Last Month">Last Month</option>
//           </select>
//         </div>
//       </div>
//       <div className="main-content">
//         {menuOption === "Reservations" ? (
//           <div className="reservations-section">
//             <h2>Reservations</h2>
//             {loading ? (
//               <p className="loading">Loading...</p>
//             ) : error ? (
//               <p className="error">{error}</p>
//             ) : (
//               <table className="order-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>No. of Persons</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reservations.map((reservation, index) => (
//                     <tr key={index}>
//                       <td>{reservation.name}</td>
//                       <td>{reservation.email || "N/A"}</td>
//                       <td>{reservation.phone}</td>
//                       <td>{reservation.persons}</td>
//                       <td>{reservation.date}</td>
//                       <td>{reservation.time}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         ) : (
//           <>
//             {menuOption !== "Tap and Collect" && (
//               <div className="tables-section">
//                 <h2>Tables</h2>
//                 <div className="table-grid">
//                   {Array.from({ length: 21 }, (_, i) => i + 1).map((table) => (
//                     <button
//                       key={table}
//                       className={`table-button ${getTableStatus(table)}`}
//                       onClick={() => setSelectedTable(table)}
//                     >
//                       Table {table}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="order-details">
//               {loading ? (
//                 <p className="loading">Loading...</p>
//               ) : error ? (
//                 <p className="error">{error}</p>
//               ) : (
//                 <>
//                   <h2>
//                     {menuOption} {selectedTable && `for Table ${selectedTable}`}
//                   </h2>
//                   {renderOrders()}
//                 </>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;




















import React, { useEffect, useState } from "react";
import "./App.css";
import VisualData from './VisualData';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTable, setSelectedTable] = useState(1); // Default table 1
  const [menuOption, setMenuOption] = useState("All Orders");
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [tapAndCollectCount, setTapAndCollectCount] = useState(0);
  const [dateFilter, setDateFilter] = useState("Today"); // Default to Today's orders

  const fetchOrders = async () => {
    try {
      const response = await fetch(`https://royalbangla-server.gofastapi.com/getOrders`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const sortedOrders = data.orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setError("");
      setNewOrderCount(sortedOrders.filter((order) => !order.isDelivered).length);
      setPendingOrderCount(sortedOrders.filter((order) => !order.isDelivered).length);
      setTapAndCollectCount(
        sortedOrders.filter((order) => parseInt(order.tableNumber) === 0 && !order.isDelivered).length
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`https://royalbangla-server.gofastapi.com/getReservations`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setReservations(data.reservations);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchReservations();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filterOrdersByDate = () => {
    const now = new Date();
    let filteredOrders = orders;

    if (dateFilter === "Today") {
      filteredOrders = orders.filter(
        (order) =>
          new Date(order.createdAt).toDateString() === now.toDateString()
      );
    } else if (dateFilter === "Last 3 Days") {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(now.getDate() - 3);
      filteredOrders = orders.filter(
        (order) => new Date(order.createdAt) >= threeDaysAgo
      );
    } else if (dateFilter === "Last 15 Days") {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(now.getDate() - 15);
      filteredOrders = orders.filter(
        (order) => new Date(order.createdAt) >= fifteenDaysAgo
      );
    } else if (dateFilter === "Last Month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filteredOrders = orders.filter(
        (order) => new Date(order.createdAt) >= oneMonthAgo
      );
    }

    return filteredOrders;
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const response = await fetch(`https://royalbangla-server.gofastapi.com/markAsDelivered`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, isDelivered: true } : order
          )
        );
        setPendingOrderCount((prevCount) => prevCount - 1);
        setTapAndCollectCount((prevCount) =>
          prevCount > 0 && orders.some((order) => order._id === orderId && parseInt(order.tableNumber) === 0)
            ? prevCount - 1
            : prevCount
        );
      } else {
        throw new Error(data.error || "Error marking order as delivered");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getTableStatus = (tableNumber) => {
    const tableOrders = orders.filter(
      (order) => parseInt(order.tableNumber) === tableNumber
    );
    return tableOrders.some((order) => !order.isDelivered) ? "pending" : "";
  };

  const handleSendTimeDetails = async (email, expectedTime, orderId) => {
    if (!expectedTime) {
      alert("Please select a valid time before sending!");
      return;
    }
 
    try {
      const response = await fetch("https://royalbangla-server.gofastapi.com/timeDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, expectedTime }),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error sending time details");
      }
 
      // Save to sessionStorage to persist disabled state and stamped time
      sessionStorage.setItem(`buttonDisabled-${orderId}`, "true");
      sessionStorage.setItem(`expectedTime-${orderId}`, expectedTime);
 
      // Update orders state to reflect the stamped time
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, expectedTime }
            : order
        )
      );
 
      alert("Time details sent successfully!");
    } catch (err) {
      alert(err.message);
    }
  };
 
 

  // const isButtonDisabled = (orderId) => {
  // return sessionStorage.getItem(`disabled-${orderId}`) === "true";
  // };

  const renderOrders = () => {
    const filteredOrders = filterOrdersByDate().filter((order) => {
      if (menuOption === "Tap and Collect") {
        // Include all Tap and Collect orders regardless of delivery status
        return parseInt(order.tableNumber) === 0;
      }
      if (menuOption === "All Orders") {
        return selectedTable
          ? parseInt(order.tableNumber) === selectedTable
          : true; // Filter by selected table if a table is selected
      }
      if (menuOption === "Undelivered Orders") {
        return (
          !order.isDelivered &&
          (selectedTable
            ? parseInt(order.tableNumber) === selectedTable
            : true) // Filter by selected table if a table is selected
        );
      }
      // For other specific cases
      return parseInt(order.tableNumber) === selectedTable;
    });

    return (
      <table className="order-table">
        <thead>
          <tr>
            {menuOption === "Tap and Collect" && <th>Email</th>}
            {menuOption === "Tap and Collect" && <th>Token ID</th>}
            <th>Dish</th>
            <th>Quantity</th>
            <th>Time</th>
            <th>Date</th>
            <th>Status</th>
            {menuOption === "Tap and Collect" && <th>Expected Time</th>}
            {menuOption === "Tap and Collect" && <th>Send</th>}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const date = new Date(order.createdAt);
            const isButtonDisabled =
              sessionStorage.getItem(`buttonDisabled-${order._id}`) === "true";
            const stampedExpectedTime =
              sessionStorage.getItem(`expectedTime-${order._id}`) ||
              order.expectedTime;

            return (
              <>
                {order.dishes.map((dish, idx) => (
                  <tr key={`${order._id}-${idx}`}>
                    {idx === 0 && menuOption === "Tap and Collect" && (
                      <>
                        <td rowSpan={order.dishes.length} className="bold-text">
                          {order.email || "N/A"}
                        </td>
                        <td rowSpan={order.dishes.length} className="bold-text">
                          {order.tokenId || "N/A"}
                        </td>
                      </>
                    )}
                    <td>{dish.name}</td>
                    <td>{dish.quantity}</td>
                    {idx === 0 && (
                      <>
                        <td rowSpan={order.dishes.length}>
                          {date.toLocaleTimeString()}
                        </td>
                        <td rowSpan={order.dishes.length}>
                          {date.toLocaleDateString()}
                        </td>
                        <td rowSpan={order.dishes.length}>
                          <span
                            className={`status ${order.isDelivered ? "delivered" : "pending"
                              }`}
                          >
                            {order.isDelivered ? "Delivered" : "Pending"}
                          </span>
                        </td>
                        {menuOption === "Tap and Collect" && (
                          <>
                            <td rowSpan={order.dishes.length}>
                              {stampedExpectedTime ? (
                                <span className="expected-time">
                                  {stampedExpectedTime}
                                </span>
                              ) : (
                                <select
                                  className="select-expected-time"
                                  defaultValue=""
                                  onChange={(e) => {
                                    const selectedTime = e.target.value;
                                    sessionStorage.setItem(
                                      `expectedTime-${order._id}`,
                                      selectedTime
                                    );
                                    order.expectedTime = selectedTime;
                                    setOrders([...orders]);
                                  }}
                                  disabled={
                                    isButtonDisabled || order.isDelivered
                                  }
                                >
                                  <option value="" disabled>
                                    Select Time
                                  </option>
                                  <option value="10 min">10 min</option>
                                  <option value="20 min">20 min</option>
                                  <option value="30 min">30 min</option>
                                  <option value="1 hr">1 hr</option>
                                </select>
                              )}
                            </td>
                            <td rowSpan={order.dishes.length}>
                              <button
                                className="send-button"
                                onClick={() =>
                                  handleSendTimeDetails(
                                    order.email,
                                    stampedExpectedTime || "",
                                    order._id
                                  )
                                }
                                disabled={
                                  isButtonDisabled ||
                                  !stampedExpectedTime ||
                                  order.isDelivered
                                }
                              >
                                {isButtonDisabled || order.isDelivered
                                  ? "Sent"
                                  : "Send"}
                              </button>
                            </td>
                          </>
                        )}
                        <td rowSpan={order.dishes.length}>
                          <button
                            className={`mark-delivered ${order.isDelivered ? "delivered" : "pending"
                              }`}
                            onClick={() => handleMarkAsDelivered(order._id)}
                            disabled={order.isDelivered}
                          >
                            {order.isDelivered
                              ? "Delivered"
                              : "Mark as Delivered"}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    );
  };

 
 
 

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul className="menu-list">
          {["All Orders", "Undelivered Orders", "Tap and Collect", "Reservations", "Visual Data"].map((item) => (
            <li
              key={item}
              className={`menu-item ${menuOption === item ? "active" : ""}`}
              onClick={() => {
                setMenuOption(item);
                setSelectedTable(item === "Tap and Collect" ? null : 1);
              }}
            >
              <span className="menu-icon">
                {item === "All Orders"
                  ? "📦"
                  : item === "Undelivered Orders"
                    ? "⏳"
                    : item === "Tap and Collect"
                      ? "🛒"
                      : "📅"}
              </span>
              {item}{" "}
              {item === "All Orders" && newOrderCount > 0 && (
                <span className="badge">{newOrderCount}</span>
              )}
              {item === "Undelivered Orders" && pendingOrderCount > 0 && (
                <span className="badge">{pendingOrderCount}</span>
              )}
              {item === "Tap and Collect" && tapAndCollectCount > 0 && (
                <span className="badge">{tapAndCollectCount}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="date-filters">
          <h3>Filter by Date</h3>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="Today">Today's Orders</option>
            <option value="Last 3 Days">Last 3 Days</option>
            <option value="Last 15 Days">Last 15 Days</option>
            <option value="Last Month">Last Month</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        {menuOption === "Reservations" ? (
  <div className="reservations-section">
    <h2>Reservations</h2>
    {loading ? (
      <p className="loading">Loading...</p>
    ) : error ? (
      <p className="error">{error}</p>
    ) : (
      <table className="order-table">
        <thead>
          <tr>
            <th className="bold-text">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>No. of Persons</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {reservations
            .filter(reservation => new Date(reservation.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((reservation, index) => (
              <tr key={index}>
                <td className="bold-text" >{reservation.name}</td>
                <td>{reservation.email || "N/A"}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.persons}</td>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
        ) : menuOption === "Visual Data" ? (
          <VisualData orders={orders} reservations={reservations} dateFilter={dateFilter} />
        ) : (
          <>
            {menuOption !== "Tap and Collect" && (
              <div className="tables-section">
                <h2>Tables</h2>
                <div className="table-grid">
                  {Array.from({ length: 21 }, (_, i) => i + 1).map((table) => (
                    <button
                      key={table}
                      className={`table-button ${getTableStatus(table)}`}
                      onClick={() => setSelectedTable(table)}
                    >
                      Table {table}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="order-details">
              {loading ? (
                <p className="loading">Loading...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                <>
                  <h2>
                    {menuOption} {selectedTable && `for Table ${selectedTable}`}
                  </h2>
                  {renderOrders()}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

















