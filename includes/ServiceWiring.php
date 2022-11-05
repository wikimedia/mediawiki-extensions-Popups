<?php

use MediaWiki\Logger\LoggerFactory;
use MediaWiki\MediaWikiServices;
use Popups\PopupsContext;
use Popups\PopupsGadgetsIntegration;

/**
 * @codeCoverageIgnore
 */
return [
	'Popups.Config' => static function ( MediaWikiServices $services ) {
		return $services->getService( 'ConfigFactory' )
			->makeConfig( PopupsContext::EXTENSION_NAME );
	},
	'Popups.GadgetsIntegration' => static function ( MediaWikiServices $services ) {
		return new PopupsGadgetsIntegration(
			$services->getService( 'Popups.Config' ),
			ExtensionRegistry::getInstance()
		);
	},
	'Popups.Logger' => static function ( MediaWikiServices $services ) {
		return LoggerFactory::getInstance( PopupsContext::LOGGER_CHANNEL );
	},
	'Popups.Context' => static function ( MediaWikiServices $services ) {
		return new PopupsContext(
			$services->getService( 'Popups.Config' ),
			ExtensionRegistry::getInstance(),
			$services->getService( 'Popups.GadgetsIntegration' ),
			$services->getSpecialPageFactory(),
			$services->getUserOptionsLookup()
		);
	}
];
