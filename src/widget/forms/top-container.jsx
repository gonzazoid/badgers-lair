import styled from "styled-components";

const TopContainer = styled.div`
  position: relative;
  border: dashed 1px #d7d7d7;
  background-color: #f7f7f7;
  padding: 8px 12px;
  margin-top: ${props => (props.root === "true" ? "20px" : "0px")};
  margin-left: .5rem;
`;

export default TopContainer;
