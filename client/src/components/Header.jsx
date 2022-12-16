import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { HiUserCircle, HiMenu } from "react-icons/hi";

const StyledHeader = styled.header`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2% 5%;
  box-sizing: border-box;
  border-bottom: 1px solid lightgray;
`;

const StyledSearchBar = styled.div`
  border-radius: 20px;
  height: 40px;
  width: 25%;
  position: relative;
  border: 1px solid #c3c2c2;
  cursor: pointer;

  > svg {
    position: absolute;
    top: 6px;
    right: 5px;
  }

  ${(props) =>
    props.toggle &&
    css`
      display: none;
    `}
`;

const ActiveSearchBar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 40%;
  position: relative;

  button {
    border: 0;
    cursor: pointer;
    background-color: white;
    margin: 0 40px;
    font-size: 30px;

    &:hover {
      text-decoration: underline;
    }
  }

  div {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
`;
const SearchOption = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  border: 1px solid black;
  border-radius: 20px;
  height: 60px;

  div {
    display: flex;
    align-items: center;
    border-radius: 20px;
    height: 100%;
    z-index: 9999;

    &:hover {
      cursor: pointer;
      background-color: lightgray;
    }
  }
`;

const SearchMenu = ({children}) => {
  return (
    <SearchContainer>
      {children}
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  position : absolute;
  border: 1px solid black;
  background-color:white;
  top : 150px;

`

const StyledNav = styled.div`
  border-radius: 20px;
  border: 1px solid #c3c2c2;
  padding: 3px;
  ${(props) =>
    props.toggle &&
    css`
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
      transition: box-shadow 0.2s ease;
    `}
  button {
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
  }

  svg + svg {
    padding-left: 3px;
  }
`;

const StyledMenu = styled.div`
  display: none;
  ${(props) =>
    props.toggle &&
    css`
      display: block;
    `}
  position: absolute;
  top: 10%;
  right: 5%;
  background: #fff;
  border-radius: 10px;
  box-shadow: -1px -1px 10px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(0, 0, 0, 0.18);
  width: 20%;
  padding: 1% 0;
  box-sizing: border-box;
  z-index: 9999;
`;
const StyledLink = styled(Link)`
  padding: 5%;

  &:hover {
    background: lightgray;
  }
`;

const StyledLogout = styled.div`
  > button {
    background: none;
    border: none;
    padding: 5%;
    font-size: 1rem;
    width: 100%;
    text-align: left;
    font-weight: bold;

    &:hover {
      background: lightgray;
    }
  }

  &::before {
    content: "";
    display: block;
    height: 1px;
    width: 100%;
    background: lightgray;
    margin: 5px 0px;
  }
`;

const beforeLoginList = [
  {
    id: 1,
    name: "로그인",
    path: "/login",
  },
  {
    id: 2,
    name: "회원가입",
    path: "/register",
  },
];

const afterLoginList = [
  {
    id: 3,
    name: "내정보관리",
    path: "/login",
  },
  {
    id: 4,
    name: "예약조회",
    path: "/register",
  },
  {
    id: 5,
    name: "나의후기",
    path: "/register",
  },
  {
    id: 6,
    name: "찜목록",
    path: "/register",
  },
];

const Header = () => {
  const [isOpenSearchBar, setIsOpenSearchBar] = useState(false);
  const [searchOption, setSearchOption] = useState("location");
  const [option, setOption] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef();
  const searchRef = useRef();

  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  const handleClickOutSide = (e) => {
    console.log(ref.current.contains(e.target));
    if (toggleMenu && !ref.current.contains(e.target)) {
      setToggleMenu(false);
    }

    if (isOpenSearchBar && !searchRef.current.contains(e.target)){
      setIsOpenSearchBar(false);
      setOption(false);
    }
  };

  useEffect(() => {
    if (toggleMenu) document.addEventListener("mousedown", handleClickOutSide);
    if (isOpenSearchBar) document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  });

  useEffect(() => {
    setToggleMenu(false);
  }, [params]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSearchBar = () => {
    if (!isOpenSearchBar) setIsOpenSearchBar(true);
  };

  const handleSearchOption = (e) => {
    setSearchOption(e.target.name);
  };

  const handleSearchMenu = (e) => {
    setOption(e.target.id);
  };

  return (
    <StyledHeader>
      <img src="" alt="logo" />
      {isOpenSearchBar && (
        <ActiveSearchBar toggle={isOpenSearchBar} ref={searchRef}>
          <div>
            <button name="location" onClick={(e) => handleSearchOption(e)}>
              지역
            </button>
            <button name="fruit" onClick={(e) => handleSearchOption(e)}>
              과일
            </button>
          </div>
          <SearchOption>
            {searchOption === "location" ? (
              <div id="location" onClick={e=> handleSearchMenu(e)}>장소</div>
            ) : (
              <div id="fruit" onClick={e=>handleSearchMenu(e)}>과일</div>
            )}
            <div id="date" onClick={e=>handleSearchMenu(e)}>날짜</div>
            <div id="number" onClick={e=>handleSearchMenu(e)}>인원</div>
            {
              option === "location" && searchOption === 'location' && <SearchMenu children={<div>지역 테스트</div>}/> ||
              option === "date" && <SearchMenu children={<div>날짜 테스트</div>}/> ||
              option === "number" && <SearchMenu children={<div>사람 수 테스트</div>}/> ||
              option === "fruit" && searchOption === 'fruit' && <SearchMenu children={<div>과일 테스트</div>}/>
            }
          </SearchOption>
        </ActiveSearchBar>
      )}
      <StyledSearchBar toggle={isOpenSearchBar} onClick={handleSearchBar}>
        <AiOutlineSearch size={25} />
      </StyledSearchBar>
      <div ref={ref}>
        <StyledNav toggle={toggleMenu} ref={ref}>
          <button onClick={handleToggleMenu}>
            <HiMenu size={25} />
            <HiUserCircle size={30} />
          </button>
        </StyledNav>
        <StyledMenu toggle={toggleMenu} ref={ref}>
          {token === null ? (
            <div>
              {beforeLoginList.map((item) => (
                <StyledLink to={item.path} key={item.id}>
                  {item.name}
                </StyledLink>
              ))}
            </div>
          ) : (
            <div>
              {afterLoginList.map((item) => (
                <StyledLink to={item.path} key={item.id}>
                  {item.name}
                </StyledLink>
              ))}
              <StyledLogout>
                <button onClick={logout}>로그아웃</button>
              </StyledLogout>
            </div>
          )}
        </StyledMenu>
      </div>
    </StyledHeader>
  );
};

export default Header;
