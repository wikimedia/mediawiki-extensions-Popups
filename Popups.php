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

$localBasePath = dirname( __DIR__ ) . '/Popups';
$remoteExtPath = 'Popups';

$wgResourceModules = array_merge( $wgResourceModules, array(
	'ext.popups' => array(
		'scripts' => array(
			'resources/ext.popups.core.js',
		),
		'styles' => array(
			'resources/ext.popups.core.less',
			'resources/ext.popups.animation.less',
		),
		'dependencies' => array(
			'mediawiki.api',
		),
		'messages' => array(
			'popups-edited-seconds',
			'popups-edited-minutes',
			'popups-edited-hours',
			'popups-edited-days',
			'popups-edited-years',
			'popups-redirects',
		),
		'remoteExtPath' => $remoteExtPath,
		'localBasePath' => $localBasePath,
	),

	'schema.Popups' => array(
		'class'  => 'ResourceLoaderSchemaModule',
		'schema' => 'Popups',
		'revision' => 7536956,
	),
) );

$wgAutoloadClasses['PopupsHooks'] = __DIR__ . '/Popups.hooks.php';
$wgExtensionMessagesFiles['Popups'] = __DIR__ . '/Popups.i18n.php';

$wgHooks['GetBetaFeaturePreferences'][] = 'PopupsHooks::getPreferences';
$wgHooks['BeforePageDisplay'][] = 'PopupsHooks::onBeforePageDisplay';
