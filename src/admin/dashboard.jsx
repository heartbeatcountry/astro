import { Box, H2, Text } from "@adminjs/design-system";

import { useTranslation } from "adminjs";

export const Dashboard = () => {
	const { translateMessage } = useTranslation();
	return (
		<Box
			py={74}
			px={["default", "lg", 250]}
		>
			<Text textAlign="center" fontWeight="bolder">
				<H2>{translateMessage("welcomeOnBoard_title")}</H2>
				<Text opacity={0.8}>
					{translateMessage("welcomeOnBoard_subtitle")}
				</Text>
			</Text>
		</Box>
	);
};

export default Dashboard;
