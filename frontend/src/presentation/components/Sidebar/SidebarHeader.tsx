import Logo from "../Logo"

export const SidebarHeader = () => {
	return (
		<div className="d-flex align-items-center justify-content-between w-100">
			<div className="d-flex align-items-center">
				<div
					className="bg-primary-gradient rounded-circle d-flex align-items-center justify-content-center me-2"
					style={{ width: '35px', height: '35px' }}
				>
					<Logo width={20} height={20} color="white" fillColor="transparent" />
				</div>
				<span className="heading-5 text-neutral-900 mb-0">CarpManager</span>
			</div>
		</div>
	)
}
