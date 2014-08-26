<?php
/*
 * This file is part of the MediaWiki extension Popups.
 *
 * Popups is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Popups is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Popups.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This extension requires that the PageImages and TextExtracts
 * extensions have also been installed.
 *
 * Install BetaFeatures if you don't want Popups to load for all users.
 *
 * @file
 * @ingroup extensions
 */

$wgExtensionCredits['betafeatures'][] = array(
	'author' => array( 'Prateek Saxena', 'Yair Rand' ),
	'descriptionmsg' => 'popups-desc',
	'name' => 'Popups',
	'path' => __FILE__,
	'url' => 'https://www.mediawiki.org/wiki/Extension:Popups',
);

$wgAutoloadClasses['PopupsHooks'] = __DIR__ . '/Popups.hooks.php';
$wgMessagesDirs['Popups'] = __DIR__ . '/i18n';
$wgExtensionMessagesFiles['Popups'] = __DIR__ . '/Popups.i18n.php';

$wgHooks['GetBetaFeaturePreferences'][] = 'PopupsHooks::getPreferences';
$wgHooks['BeforePageDisplay'][] = 'PopupsHooks::onBeforePageDisplay';
$wgHooks['ResourceLoaderTestModules'][] = 'PopupsHooks::onResourceLoaderTestModules';
$wgHooks[ 'ResourceLoaderRegisterModules' ][] = function ( ResourceLoader &$resourceLoader ) {

	$moduleDependencies = array(
		'mediawiki.api',
		'mediawiki.jqueryMsg',
		'moment',
		'jquery.jStorage',
		'jquery.client',
	);

	// If EventLogging is present, declare the schema module
	// and add it to the array of dependencies.
	if ( class_exists( 'ResourceLoaderSchemaModule' ) ) {
		$resourceLoader->register( "schema.Popups", array(
			'class'    => 'ResourceLoaderSchemaModule',
			'schema'   => 'Popups',
			'revision' => 7536956,
		) );

		$moduleDependencies[] = "schema.Popups";
	}

	$resourceLoader->register( "ext.popups", array(
		'scripts' => array(
			'resources/ext.popups.core.js',
			'resources/ext.popups.eventlogging.js',
			'resources/ext.popups.renderer.js',
			'resources/ext.popups.renderer.article.js',
			'resources/ext.popups.disablenavpop.js',
			'resources/ext.popups.settings.js',
		),
		'styles' => array(
			'resources/ext.popups.core.less',
			'resources/ext.popups.animation.less',
			'resources/ext.popups.settings.less',
		),
		'dependencies' => $moduleDependencies,
		'messages' => array(
			'popups-last-edited',
			"popups-settings-title",
			"popups-settings-description",
			"popups-settings-option-simple",
			"popups-settings-option-simple-description",
			"popups-settings-option-advanced",
			"popups-settings-option-advanced-description",
			"popups-settings-option-off",
			"popups-settings-option-off-description",
			"popups-settings-save",
			"popups-settings-cancel",
			"popups-settings-enable",
		),
		'remoteExtPath' => 'Popups',
		'localBasePath' => dirname( __DIR__ ) . '/Popups',
	) );
	return true;
};
