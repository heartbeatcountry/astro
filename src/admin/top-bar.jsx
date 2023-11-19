import { Box, Icon, cssClass, Text, Button, Link } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

const NavBar =
	styled(Box)`
  height: ${({ theme }) => theme.sizes.navbarHeight};
  border-bottom: ${({ theme }) => theme.borders.default};
  background: ${({ theme }) => theme.colors.container};
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
`;

export const TopBar = (props) => {
	const { toggleSidebar } = props;

	return (
		<NavBar data-css="topbar">
			<Box
				py="lg"
				px={["default", "lg"]}
				onClick={toggleSidebar}
				display={["block", "block", "block", "block", "none"]}
				style={{ cursor: "pointer" }}
			>
				<Icon icon="Menu" size={24} />
			</Box>
			<Box marginLeft="auto" padding="0 2em">
				<Link href="/compte">
					<Button variant="outlined" size="md" color="secondary">
						Mon compte
					</Button>
				</Link>
			</Box>
		</NavBar>
	);
};

export {TopBar as default, TopBar as OriginalTopBar};
