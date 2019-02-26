<?php

use MediaWiki\Logger\LoggerFactory;
use MediaWiki\MediaWikiServices;
use Popups\EventLogging\EventLoggerFactory;
use Popups\PopupsContext;
use Popups\PopupsGadgetsIntegration;
use Popups\UserPreferencesChangeHandler;

/**
 * @codeCoverageIgnore
 */
return [
	'Popups.Config' => function ( MediaWikiServices $services ) {
		return $services->getService( 'ConfigFactory' )
			->makeConfig( PopupsContext::EXTENSION_NAME );
	},
	'Popups.GadgetsIntegration' => function ( MediaWikiServices $services ) {
		return new PopupsGadgetsIntegration(
			$services->getService( 'Popups.Config' ),
			ExtensionRegistry::getInstance()
		);
	},
	'Popups.EventLogger' => function ( MediaWikiServices $services ) {
		$factory = new EventLoggerFactory(
			ExtensionRegistry::getInstance()
		);
		return $factory->get();
	},
	'Popups.UserPreferencesChangeHandler' => function ( MediaWikiServices $services ) {
		return new UserPreferencesChangeHandler(
			$services->getService( 'Popups.Context' )
		);
	},
	'Popups.Logger' => function ( MediaWikiServices $services ) {
		return LoggerFactory::getInstance( PopupsContext::LOGGER_CHANNEL );
	},
	'Popups.Context' => function ( MediaWikiServices $services ) {
		return new PopupsContext(
			$services->getService( 'Popups.Config' ),
			ExtensionRegistry::getInstance(),
			$services->getService( 'Popups.GadgetsIntegration' ),
			$services->getService( 'Popups.EventLogger' )
		);
	}
];
