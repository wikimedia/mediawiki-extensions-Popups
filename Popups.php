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

if ( function_exists( 'wfLoadExtension' ) ) {
	wfLoadExtension( 'Popups' );
	// Keep i18n globals so mergeMessageFileList.php doesn't break
	$wgMessagesDirs['Popups'] = __DIR__ . '/i18n';
	/* wfWarn(
		'Deprecated PHP entry point used for Popups extension. Please use wfLoadExtension instead, ' .
		'see https://www.mediawiki.org/wiki/Extension_registration for more details.'
	); */
	return;
} else {
	die( 'This version of the Popups extension requires MediaWiki 1.25+' );
}
