const TabNavItem = ({ id, title, activeTab, setActiveTab ,tabIcon }) => {
  const handleClick = () => {
    setActiveTab(id);
  };

  return (
    <li onClick={handleClick} className={activeTab === id ? "active" : ""}>
      <figure className="mb-0">
        <img src={tabIcon} alt="Collection" className="me-3"></img>
      </figure>
      {title}
    </li>
  );
};
export default TabNavItem;
