export const carouselHTML = `
<fxs-vslot class="carousel-outer w-full">
	<fxs-hslot class="carousel-main-hslot">
		<!-- close button -->
		<div class="carousel-close-button-div absolute top-2 right-2 hidden">
			<fxs-close-button class="carousel-close-button"></fxs-close-button>
		</div>
		
		<!-- loading symbol -->
		<div class="carousel-hour-glass hidden relative h-16 mt-12 mb-12 bg-center bg-no-repeat"></div>
		
		<!-- decorative image border -->
		<fxs-hslot class="carousel-top-filigree decoration w-full justify-center items-center absolute -top-9">
			<div class="img-top-filigree-left grow"></div>
			<div class="img-top-filigree-center"></div>
			<div class="img-top-filigree-right grow"></div>
		</fxs-hslot>
		
		<!-- content -->
		<div class="carousel-content relative pointer-events-auto flex flex-col font-body text-base text-accent-2">
			<!-- title -->
			<div class="carousel-title justify-center">
				<fxs-hslot class="justify-center">
					<!-- left arrow -->
					<fxs-activatable class="carousel-expanded-bumper carousel-clickable carousel-left-bumper carousel-bumper relative pointer-events-auto align-center bg-no-repeat bg-cover w-12 h-14 self-center">
							<fxs-nav-help action-key='inline-nav-shell-previous'></fxs-nav-help>
					</fxs-activatable>

					<!-- title text -->
					<div class="carousel-text relative flex self-center text-center font-title text-accent-2"> </div>
					
					<!-- right arrow -->
					<fxs-activatable
							 class="carousel-expanded-bumper carousel-clickable carousel-right-bumper carousel-bumper -scale-x-100 relative pointer-events-auto align-center bg-no-repeat bg-cover w-12 h-14 self-center">
						<fxs-nav-help class='-scale-x-100' action-key='inline-nav-shell-next'></fxs-nav-help>
					</fxs-activatable>
				</fxs-hslot>

				<div class="carousel-title-filigree filigree-divider-h3 w-80 self-center mb-2"></div>
			</div>

			<!-- image container -->
			<fxs-activatable class="carousel-image-container"></fxs-activatable>

			<!-- main text -->
			<fxs-scrollable class="carousel-text-only-scrollable w-full py-2 px-4 mx-6 relative flex self-center justify-center" handle-gamepad-pan="true">
				<div class="carousel-text-content text-justify text-accent-2 font-normal"> </div>
			</fxs-scrollable>

			<!-- caption -->
			<fxs-hslot class="carousel-standard-layout realtive hidden hidden ml-4 mt-4">
				<div class="carousel-standard-layout-image flex flex-auto"></div>

				<fxs-scrollable class="carousel-standard-layout-text px-8 -mt-36 flex flex-auto self-center justify-center" handle-gamepad-pan="true" tabindex="-1">
					<div class="carousel-standard-text-content text-center text-accent-2 font-normal text-lg"></div>
				</fxs-scrollable>
			</fxs-hslot>
		</div>

		<!-- left arrow -->
		<fxs-activatable class="carousel-clickable carousel-thumbnail-bumper carousel-left-bumper carousel-bumper absolute pointer-events-auto align-center bg-no-repeat bg-cover w-12 h-14 self-center left-2">
			<fxs-nav-help action-key='inline-nav-shell-previous'></fxs-nav-help>
		</fxs-activatable>
		
		<!-- right arrow -->
		<fxs-activatable class="carousel-clickable carousel-thumbnail-bumper carousel-right-bumper carousel-bumper -scale-x-100 absolute pointer-events-auto align-center bg-no-repeat bg-cover w-12 h-14 self-center right-2">
			<fxs-nav-help class='-scale-x-100' action-key='inline-nav-shell-next'></fxs-nav-help>
		</fxs-activatable>
	</fxs-hslot>
	
	<!-- breadcrumb buttons -->
	<fxs-hslot class="carousel-breadcrumb-bar justify-center absolute bottom-2"></fxs-hslot>
	
	<!-- pop-up -->
	<div class="carousel-back-button-container flex flex-row justify-center w-full">
		<fxs-nav-help class="carousel-content-help flex absolute w-0\.5 -top-4 right-4" action-key='inline-shell-action-1'></fxs-nav-help>
		<fxs-button class="carousel-back-button hidden" caption="LOC_GENERIC_BACK"></fxs-button>
		<fxs-button class="carousel-interact-button hidden" caption="LOC_GENERIC_GO"></fxs-button>
	</div>
</fxs-vslot>

<!-- bottom caption title -->
<div class="carousel-thumb-bg carousel-outer w-full bg-primary-4">
	<p class="carousel-thumb-title mt-2 font-title text-lg text-shadow self-center font-fit-shrink whitespace-nowrap"></p>
</div>
`;