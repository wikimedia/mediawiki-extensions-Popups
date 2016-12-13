<?php
/**
 * Module.php
 */
namespace Popups;

/**
 * Popups Module
 *
 * @package Popups
 */
final class Module {
	/**
	 * @var \Config
	 */
	private $config;

	/**
	 * Module constructor.
	 * @param \Config $config
	 */
	public function __construct( \Config $config ) {
		$this->config = $config;
	}

	/**
	 * Are Page previews visible on User Preferences Page
	 *
	 * return @bool
	 */
	public function showPreviewsOptInOnPreferencesPage() {
		return $this->config->get( 'PopupsBetaFeature' ) === false
			&& $this->config->get( 'PopupsHideOptInOnPreferencesPage' ) === false;
	}
}
