<?php

use Popups\Module;

/**
 * Popups module tests
 *
 * @group Popups
 */
class ModuleTest extends MediaWikiTestCase {
	/**
	 * @covers Popups\Module::showPreviewsOptInOnPreferencesPage
	 * @dataProvider provideConfigForShowPreviewsInOptIn
	 */
	public function testShowPreviewsPreferencesWhenBetaIsOn( $config, $enabled ) {
		$options = new HashConfig( $config );
		$module = new Module( $options );
		$this->assertEquals( $enabled, $module->showPreviewsOptInOnPreferencesPage() );
	}

	/**
	 * @return array
	 */
	public function provideConfigForShowPreviewsInOptIn() {
		return [
			[
				"options" => [
					"PopupsBetaFeature" => false,
					"PopupsHideOptInOnPreferencesPage" => false
				],
				"enabled" => true
			],
			[
				"options" => [
					"PopupsBetaFeature" => true,
					"PopupsHideOptInOnPreferencesPage" => false
				],
				"enabled" => false
			],
			[
				"options" => [
					"PopupsBetaFeature" => false,
					"PopupsHideOptInOnPreferencesPage" => true
				],
				"enabled" => false
			]
		];
	}
}
