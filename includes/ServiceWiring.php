<?php

use MediaWiki\Config\Config;
use MediaWiki\Logger\LoggerFactory;
use MediaWiki\MediaWikiServices;
use MediaWiki\Registration\ExtensionRegistry;
use Popups\PopupsContext;
use Popups\PopupsGadgetsIntegration;
use Psr\Log\LoggerInterface;

/**
 * @codeCoverageIgnore
 */
return [
	'Popups.Config' => static function ( MediaWikiServices $services ): Config {
		return $services->getService( 'ConfigFactory' )
			->makeConfig( PopupsContext::EXTENSION_NAME );
	},
	'Popups.GadgetsIntegration' => static function ( MediaWikiServices $services ): PopupsGadgetsIntegration {
		return new PopupsGadgetsIntegration(
			$services->getService( 'Popups.Config' ),
			ExtensionRegistry::getInstance()->isLoaded( 'Gadgets' ) ?
				$services->getService( 'GadgetsRepo' ) :
				null
		);
	},
	'Popups.Logger' => static function ( MediaWikiServices $services ): LoggerInterface {
		return LoggerFactory::getInstance( PopupsContext::LOGGER_CHANNEL );
	},
	'Popups.Context' => static function ( MediaWikiServices $services ): PopupsContext {
		return new PopupsContext(
			$services->getService( 'Popups.Config' ),
			ExtensionRegistry::getInstance(),
			$services->getService( 'Popups.GadgetsIntegration' ),
			$services->getSpecialPageFactory(),
			$services->getUserOptionsLookup()
		);
	}
];
